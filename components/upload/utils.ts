export interface Question {
    answer: string;
    question: string;
    dummy: string;
    source: string;
}

export interface Section {
    index: number;
    text: string;
    embedding: string;
    id: string;
    questions: Question[];
    
}