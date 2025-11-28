
// A realistic, approximate topic-wise weightage for SSC CHSL mock tests.

export const SSC_CHSL_TIER1_TOPIC_DISTRIBUTION = {
    'General Intelligence (Reasoning)': [
        { topicKeywords: ['analogy', 'classification'], min: 3, max: 5 },
        { topicKeywords: ['series', 'missing numbers'], min: 2, max: 4 },
        { topicKeywords: ['coding-decoding', 'word formation'], min: 2, max: 3 },
        { topicKeywords: ['syllogism', 'venn diagram'], min: 1, max: 2 },
        { topicKeywords: ['direction', 'blood relations', 'order & ranking'], min: 2, max: 3 },
        { topicKeywords: ['paper folding', 'mirror', 'embedded', 'figure completion', 'non-verbal'], min: 3, max: 5 },
        { topicKeywords: ['statement & conclusions', 'assumptions'], min: 2, max: 3 },
        { topicKeywords: ['symbols and notations'], min: 0, max: 2 },
    ],
    'Quantitative Aptitude (Maths)': [
        { topicKeywords: ['data interpretation'], min: 2, max: 4 },
        { topicKeywords: ['geometry', 'mensuration'], min: 3, max: 5 },
        { topicKeywords: ['trigonometry'], min: 1, max: 2 },
        { topicKeywords: ['algebra'], min: 2, max: 3 },
        { topicKeywords: ['percentage', 'profit, loss', 'discount'], min: 2, max: 3 },
        { topicKeywords: ['ratio', 'average', 'partnership', 'mixture'], min: 2, max: 3 },
        { topicKeywords: ['time, speed & distance', 'time & work'], min: 2, max: 3 },
        { topicKeywords: ['number system', 'simplification', 'interest'], min: 1, max: 2 },
    ],
    'English Language': [
        { topicKeywords: ['cloze test', 'reading comprehension'], min: 7, max: 10 },
        { topicKeywords: ['spot the error', 'sentence improvement'], min: 2, max: 4 },
        { topicKeywords: ['fill in the blanks', 'para jumbles'], min: 2, max: 4 },
        { topicKeywords: ['synonyms', 'antonyms'], min: 1, max: 2 },
        { topicKeywords: ['spelling', 'one-word substitution', 'idioms'], min: 2, max: 3 },
        { topicKeywords: ['active & passive voice', 'direct & indirect speech'], min: 1, max: 2 },
    ],
    'General Awareness': [
        { topicKeywords: ['current affairs'], min: 4, max: 6 },
        { topicKeywords: ['history'], min: 2, max: 4 },
        { topicKeywords: ['polity'], min: 2, max: 3 },
        { topicKeywords: ['geography'], min: 2, max: 3 },
        { topicKeywords: ['economy'], min: 2, max: 3 },
        { topicKeywords: ['science', 'biology', 'physics', 'chemistry'], min: 4, max: 6 },
    ],
};

export const SSC_CHSL_TIER2_TOPIC_DISTRIBUTION = {
    'Mathematical Abilities': [
        { topicKeywords: ['data interpretation'], min: 2, max: 4 },
        { topicKeywords: ['lines and angles', 'triangles', 'circles', 'polygons', 'quadrilaterals', 'perimeter and area', 'volume and surface area'], min: 5, max: 7 },
        { topicKeywords: ['trigonometry'], min: 2, max: 3 },
        { topicKeywords: ['algebra'], min: 2, max: 4 },
        { topicKeywords: ['percentage', 'profit, loss', 'discount', 'interest'], min: 2, max: 4 },
        { topicKeywords: ['ratio', 'average', 'partnership', 'mixture'], min: 2, max: 4 },
        { topicKeywords: ['time, speed & distance', 'time, work & wages'], min: 1, max: 2 },
        { topicKeywords: ['number system', 'simplification', 'decimals'], min: 1, max: 2 },
    ],
    'Reasoning and General Intelligence': [
        { topicKeywords: ['analogy', 'classification'], min: 3, max: 5 },
        { topicKeywords: ['series', 'matrix', 'pattern completion'], min: 4, max: 6 },
        { topicKeywords: ['coding-decoding'], min: 2, max: 3 },
        { topicKeywords: ['syllogism', 'statement & conclusion'], min: 3, max: 5 },
        { topicKeywords: ['blood relations', 'direction', 'ranking'], min: 2, max: 4 },
        { topicKeywords: ['mirror', 'embedded', 'paper folding'], min: 2, max: 4 },
        { topicKeywords: ['logical reasoning', 'decision making'], min: 2, max: 3 },
        { topicKeywords: ['symbols and notations'], min: 0, max: 2 },
    ],
    'English Language and Comprehension': [
        { topicKeywords: ['reading comprehension', 'cloze test'], min: 10, max: 15 },
        { topicKeywords: ['para jumbles', 'sentence rearrangement'], min: 3, max: 5 },
        { topicKeywords: ['grammar', 'parts of speech', 'tenses', 'voice', 'speech', 'articles', 'prepositions', 'conjunctions', 'sentence correction', 'error detection'], min: 7, max: 10 },
        { topicKeywords: ['vocabulary', 'synonyms', 'antonyms', 'one word', 'idioms', 'spelling'], min: 7, max: 10 },
    ],
    'General Awareness': [
        { topicKeywords: ['current affairs', 'schemes'], min: 4, max: 6 },
        { topicKeywords: ['history'], min: 2, max: 3 },
        { topicKeywords: ['geography', 'environment'], min: 2, max: 3 },
        { topicKeywords: ['polity'], min: 1, max: 2 },
        { topicKeywords: ['economy'], min: 1, max: 2 },
        { topicKeywords: ['science', 'physics', 'chemistry', 'biology', 'space', 'defence'], min: 2, max: 4 },
    ],
    'Computer Knowledge Test': [
        { topicKeywords: ['ms office', 'word', 'excel', 'powerpoint'], min: 3, max: 5 },
        { topicKeywords: ['fundamentals', 'components', 'input', 'output', 'memory'], min: 2, max: 4 },
        { topicKeywords: ['operating systems'], min: 1, max: 2 },
        { topicKeywords: ['internet', 'email', 'browsers', 'networking'], min: 1, max: 2 },
        { topicKeywords: ['cyber security', 'viruses', 'malware'], min: 1, max: 2 },
    ],
};
