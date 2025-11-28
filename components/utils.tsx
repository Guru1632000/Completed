
import React from 'react';
import { Question } from '../types';

export const renderTextWithMarkdown = (text: string | undefined): React.ReactNode => {
    if (!text) return null;

    // A simple inline renderer for bold text
    const renderInline = (line: string) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.substring(2, part.length - 2)}</strong>;
            }
            return part;
        });
    };

    // Normalize paragraph breaks and split into blocks
    const blocks = text.replace(/\n\s*\n/g, '\n\n').split('\n\n');

    return blocks.map((block, index) => {
        const lines = block.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return null;

        // Heuristic to detect if the whole block is a list
        const isUnorderedList = lines.every(line => line.trim().startsWith('* ') || line.trim().startsWith('- '));
        const isOrderedList = lines.every(line => /^\d+\. /.test(line.trim()));

        if (isUnorderedList) {
            return (
                <ul key={index} className="list-disc pl-5 space-y-1">
                    {lines.map((item, i) => (
                        <li key={i}>{renderInline(item.trim().substring(2))}</li>
                    ))}
                </ul>
            );
        }

        if (isOrderedList) {
            return (
                <ol key={index} className="list-decimal pl-5 space-y-1">
                    {lines.map((item, i) => (
                        <li key={i}>{renderInline(item.trim().replace(/^\d+\. /, ''))}</li>
                    ))}
                </ol>
            );
        }

        // If not a list, render as a paragraph. Soft breaks within the block will be rendered as spaces.
        return (
            <p key={index} className="my-2">
                {renderInline(block)}
            </p>
        );
    });
};

export const renderQuestionText = (question: Question, theme?: { topicText: string }): React.ReactNode => {
    let text = question.questionText;
    try {
        const lines = text.split('\n').filter(line => line.trim() !== '' && !/^\s*\d+\.\s*$/.test(line.trim()));
        let listCounter = 1;
        const renumberedLines = lines.map(line => {
            const match = line.trim().match(/^(\d+\.|[IVX]+\.)\s+(.*)/);
            if (match && /^\d+\./.test(match[1])) return `${listCounter++}. ${match[2]}`;
            return line;
        });
        text = renumberedLines.join('\n');
    } catch (e) { console.error("Error pre-processing text:", e); }
    
    const topicTextColor = theme?.topicText || 'text-purple-400';

    if (text.includes("Assertion (A):") && text.includes("Reason (R):")) {
        const parts = text.split("Reason (R):");
        const assertion = parts[0].replace("Assertion (A):", "").trim();
        const reason = parts[1].trim();
        return (
            <div className="space-y-6 text-gray-100">
                <div className="p-5 bg-black/20 rounded-xl border border-white/10">
                    <strong className={`block text-sm font-bold uppercase tracking-wider mb-3 ${topicTextColor}`}>Assertion (A)</strong>
                    <p className="text-xl leading-relaxed">{renderTextWithMarkdown(assertion)}</p>
                </div>
                <div className="p-5 bg-black/20 rounded-xl border border-white/10">
                    <strong className={`block text-sm font-bold uppercase tracking-wider mb-3 ${topicTextColor}`}>Reason (R)</strong>
                    <p className="text-xl leading-relaxed">{renderTextWithMarkdown(reason)}</p>
                </div>
            </div>
        );
    }
    const statementsMatch = text.match(/Statements?:([\s\S]*?)(?=Conclusions?:|Conclusion:|Question:|Which of the following)/i);
    const conclusionsMatch = text.match(/Conclusions?:([\s\S]*)/i);
    if (statementsMatch && conclusionsMatch) {
        const intro = text.substring(0, statementsMatch.index).trim();
        const statements = statementsMatch[1].trim().split('\n').filter(s => s.trim() !== '');
        let conclusionText = conclusionsMatch[1], questionPart = '';
        const keywords = ['Which of the following', 'Find the', 'What is'];
        let qIndex = -1;
        for (const k of keywords) { const i = conclusionText.indexOf(k); if (i !== -1) { qIndex = i; break; } }
        if (qIndex !== -1) { questionPart = conclusionText.substring(qIndex); conclusionText = conclusionText.substring(0, qIndex); }
        const conclusions = conclusionText.trim().split('\n').filter(s => s.trim() !== '');
        return (
             <div className="space-y-6 text-gray-100">{intro && <p className="mb-4 text-xl font-semibold leading-relaxed">{renderTextWithMarkdown(intro)}</p>}<div className="p-5 bg-black/20 rounded-xl border border-white/10"><strong className={`block text-sm font-bold uppercase tracking-wider mb-3 ${topicTextColor}`}>Statements</strong>{statements.map((s, i) => <p key={`s-${i}`} className="text-xl leading-relaxed mb-1">{renderTextWithMarkdown(s)}</p>)}</div><div className="p-5 bg-black/20 rounded-xl border border-white/10"><strong className={`block text-sm font-bold uppercase tracking-wider mb-3 ${topicTextColor}`}>Conclusions</strong>{conclusions.map((c, i) => <p key={`c-${i}`} className="text-xl leading-relaxed mb-1">{renderTextWithMarkdown(c)}</p>)}</div>{questionPart && <p className="mt-4 text-xl font-semibold leading-relaxed">{renderTextWithMarkdown(questionPart)}</p>}</div>
        );
    }
    const startRegex = /(?:\s|:|\b)(\d+\.|[IVX]+\.)/;
    const firstMatch = text.match(startRegex);
    if (firstMatch && firstMatch.index !== undefined && firstMatch.index < text.length / 2) {
        const introEnd = firstMatch.index + firstMatch[0].indexOf(firstMatch[1]);
        const intro = text.substring(0, introEnd).trim();
        let statementsBlock = text.substring(introEnd).trim(), conclusion = '';
        const conclusionMatch = statementsBlock.match(/Which of the statements|Which one of the following|Which of the above|Which statement.*correct|Select the correct answer/i);
        if (conclusionMatch && conclusionMatch.index !== undefined) { conclusion = statementsBlock.substring(conclusionMatch.index).trim(); statementsBlock = statementsBlock.substring(0, conclusionMatch.index).trim(); }
        const splitRegex = /\s*(?=(\d+\.|[IVX]+\.))/;
        const statements = statementsBlock.split(splitRegex).filter(s => s.trim() !== '');
        if (statements.length > 1) return <div className="text-xl font-semibold text-gray-100 leading-relaxed">{intro && <p className="mb-4">{renderTextWithMarkdown(intro)}</p>}<div className="space-y-3 my-4">{statements.map((s, i) => <div key={i} className="p-4 bg-black/20 rounded-lg border border-white/10 text-lg font-normal"><p>{renderTextWithMarkdown(s.trim())}</p></div>)}</div>{conclusion && <p className="mt-4">{renderTextWithMarkdown(conclusion)}</p>}</div>;
    }
    return <p className="text-xl font-semibold text-gray-100">{renderTextWithMarkdown(text)}</p>;
};
