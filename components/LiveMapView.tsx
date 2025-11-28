import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SyllabusUnit, Topic, GeoFeature } from '../types';
import { getGeoFeaturesForTopic } from '../services/aiService';
import Loader from './Loader';

// Declare Leaflet in the global scope to satisfy TypeScript
declare const L: any;

interface LiveMapViewProps {
    onGoBack: () => void;
    syllabus: SyllabusUnit[];
}

const getIconForLayer = (layerName: string = ''): any => {
    let iconHtml = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>'; // Default dot
    let className = 'custom-leaflet-icon icon-default';
    const lowerLayerName = layerName.toLowerCase();

    if (lowerLayerName.includes('mountain') || lowerLayerName.includes('peak')) {
        iconHtml = `<svg viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2z"/></svg>`;
        className = 'custom-leaflet-icon icon-mountain';
    } else if (lowerLayerName.includes('city') || lowerLayerName.includes('capital')) {
        iconHtml = `<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
        className = 'custom-leaflet-icon icon-city';
    }

    return L.divIcon({
        html: iconHtml,
        className: className,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24]
    });
};

const getStyleForLayer = (layerName: string = '') => {
    const lowerLayerName = layerName.toLowerCase();
    if (lowerLayerName.includes('river')) {
        return { color: '#38bdf8', weight: 4, opacity: 0.8 }; // Sky blue
    } else if (lowerLayerName.includes('border')) {
        return { color: '#9ca3af', weight: 3, opacity: 0.7, dashArray: '5, 5' }; // Gray, dashed
    } else if (lowerLayerName.includes('wind')) {
            return { color: '#fde047', weight: 2, opacity: 0.8 }; // Yellow
    }
    return { color: '#a855f7', weight: 3, opacity: 0.9 }; // Default purple
};


const LiveMapView: React.FC<LiveMapViewProps> = ({ onGoBack, syllabus }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const layerControlRef = useRef<any>(null); // To hold the layer control instance
    const featureLayersRef = useRef<{ [key: string]: any }>({}); // To hold the L.layerGroup for each category

    const [selectedTopicKey, setSelectedTopicKey] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [features, setFeatures] = useState<GeoFeature[]>([]);

    const generationController = useRef<AbortController | null>(null);

    const predefinedTopics = useMemo(() => [
        { name: "Monsoon in India", unit: "Key Geographical Topics", uniqueKey: "predefined-monsoon" },
        { name: "Major Rivers of India", unit: "Key Geographical Topics", uniqueKey: "predefined-rivers" },
        { name: "Major Mountain Ranges of India", unit: "Key Geographical Topics", uniqueKey: "predefined-mountains" },
    ], []);

    const syllabusTopics = useMemo(() => {
        return syllabus
            .filter(unit => unit.title.toLowerCase().includes('geography') || unit.title.toLowerCase().includes('history'))
            .flatMap(unit => 
                unit.topics.map(topic => ({
                    ...topic,
                    uniqueKey: `${unit.id}-${topic.name}`
                }))
            );
    }, [syllabus]);

    // Combine for handler logic
    const allTopics = useMemo(() => [...predefinedTopics, ...syllabusTopics], [predefinedTopics, syllabusTopics]);
    
    // Initialize map
    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            const darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 19
            });

            const lightMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });

            const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            });
            
            mapRef.current = L.map(mapContainerRef.current, {
                center: [20.5937, 78.9629],
                zoom: 5,
                layers: [darkMap] // Set Dark as the default
            });

            const baseLayers = {
                "Dark": darkMap,
                "Light": lightMap,
                "Satellite": satelliteMap
            };

            // Initialize the layer control with base layers and add it to the map
            layerControlRef.current = L.control.layers(baseLayers, {}, { collapsed: false }).addTo(mapRef.current);

            // FIX: Force map to re-evaluate its size after a short delay
            // This fixes rendering issues when the map container is initialized in a hidden/animated state.
            setTimeout(() => {
                if (mapRef.current) {
                    mapRef.current.invalidateSize();
                }
            }, 100);
        }
    }, []);

    // Plot features on map when `features` state changes
    useEffect(() => {
        if (!mapRef.current || !layerControlRef.current) return;

        // 1. Clear previous layers from both map and control
        Object.keys(featureLayersRef.current).forEach(layerName => {
            const layer = featureLayersRef.current[layerName];
            if (mapRef.current.hasLayer(layer)) {
                mapRef.current.removeLayer(layer);
            }
            layerControlRef.current.removeLayer(layer);
        });
        featureLayersRef.current = {};

        if (features.length === 0) return;

        // 2. Group new features by layer
        const featuresByLayer = features.reduce((acc, feature) => {
            const layerName = feature.layer || 'Uncategorized';
            if (!acc[layerName]) {
                acc[layerName] = [];
            }
            acc[layerName].push(feature);
            return acc;
        }, {} as { [key: string]: GeoFeature[] });

        const allBounds = L.latLngBounds();

        // 3. Create new layers and add them
        Object.entries(featuresByLayer).forEach(([layerName, layerFeatures]) => {
            const newLayerGroup = L.layerGroup();

            // FIX: Explicitly cast layerFeatures to GeoFeature[] as type inference seems to fail here,
            // resulting in 'unknown' type and causing a 'forEach does not exist' error.
            (layerFeatures as GeoFeature[]).forEach(feature => {
                const popupContent = `<b>${feature.name}</b><br>${feature.description}`;
                
                if (feature.type === 'point' && feature.point) {
                    const icon = getIconForLayer(feature.layer);
                    const marker = L.marker(feature.point, { icon });
                    marker.bindPopup(popupContent);
                    marker.addTo(newLayerGroup);
                    allBounds.extend(feature.point);
                } else if (feature.type === 'line' && feature.path) {
                    const style = getStyleForLayer(feature.layer);
                    const polyline = L.polyline(feature.path, style);
                    polyline.bindPopup(popupContent);
                    polyline.addTo(newLayerGroup);
                    allBounds.extend(polyline.getBounds());
                }
            });

            newLayerGroup.addTo(mapRef.current);
            layerControlRef.current.addOverlay(newLayerGroup, layerName);
            featureLayersRef.current[layerName] = newLayerGroup;
        });

        // 4. Fit map to bounds
        if (allBounds.isValid()) {
            mapRef.current.fitBounds(allBounds, { padding: [50, 50] });
        }
    }, [features]);

    const handlePlotTopic = useCallback(async () => {
        if (!selectedTopicKey) {
            setError('Please select a topic first.');
            return;
        }
        
        if (generationController.current) {
            generationController.current.abort();
        }
        const controller = new AbortController();
        generationController.current = controller;

        const topic = allTopics.find(t => t.uniqueKey === selectedTopicKey);
        if (!topic) {
            setError('Selected topic not found.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setFeatures([]);

        try {
            const geoFeatures = await getGeoFeaturesForTopic(topic.name, controller.signal);
            if (!controller.signal.aborted) {
                if (geoFeatures.length === 0) {
                    setError('No geographical features were found for this topic.');
                } else {
                    setFeatures(geoFeatures);
                }
            }
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setError(err.message);
            }
        } finally {
             if (!controller.signal.aborted) {
                setIsLoading(false);
             }
        }
    }, [selectedTopicKey, allTopics]);
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 item-animated-entry">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Interactive Syllabus Map</h1>
                        <p className="mt-2 text-lg text-gray-400">Visualize geographical and historical topics from your syllabus.</p>
                    </div>
                    {onGoBack && (
                        <button onClick={onGoBack} className="btn btn-secondary flex-shrink-0 self-start sm:self-center">
                            &larr; Back to Home
                        </button>
                    )}
                </div>

                <div className="p-8 bg-black/20 rounded-2xl shadow-lg border border-white/10">
                    <div className="flex flex-col sm:flex-row items-stretch gap-4">
                        <select
                            value={selectedTopicKey}
                            onChange={(e) => setSelectedTopicKey(e.target.value)}
                            className="w-full p-4 bg-slate-900/50 text-gray-200 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-grow"
                            disabled={isLoading}
                        >
                            <option value="">-- Select a Syllabus Topic --</option>
                            <optgroup label="Key Geographical Topics">
                                {predefinedTopics.map(topic => (
                                    <option key={topic.uniqueKey} value={topic.uniqueKey}>
                                        {topic.name}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Full Syllabus Topics">
                                {syllabusTopics.map(topic => (
                                    <option key={topic.uniqueKey} value={topic.uniqueKey}>
                                        {topic.name}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                        <button
                            onClick={handlePlotTopic}
                            disabled={isLoading || !selectedTopicKey}
                            className="btn btn-primary text-lg"
                        >
                            {isLoading ? 'Plotting...' : 'Plot on Map'}
                        </button>
                    </div>
                    
                     <div className="mt-8 h-[600px] w-full bg-slate-900 rounded-xl border border-white/10 overflow-hidden relative">
                        <div id="map" ref={mapContainerRef} className="h-full w-full z-10" />
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                                <Loader message="Fetching geographical data..." activeExamType="TNPSC"/>
                            </div>
                        )}
                        {error && !isLoading &&(
                             <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20 p-4">
                                <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                    <p className="text-red-300 font-semibold">{error}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveMapView;