export class Vocabularies {
    id: number | undefined;
    collection_id: number | undefined;
    word: string | undefined;
    pos: string | undefined;
    ipa: string | undefined;
    meaning: string | undefined;
    example_sentence: string | undefined;
    example_meaning: string | undefined;
    audio_word_path: string | undefined;
    audio_example_path: string | undefined;
    created_at: Date | undefined;
    is_delete: string | undefined;

    constructor(init?: Partial<Vocabularies>) {
        if (init) {
            this.id = init.id;
            this.collection_id = init.collection_id;
            this.word = init.word;
            this.pos = init.pos;
            this.ipa = init.ipa;
            this.meaning = init.meaning;
            this.example_sentence = init.example_sentence;
            this.example_meaning = init.example_meaning;
            this.audio_word_path = init.audio_word_path;
            this.audio_example_path = init.audio_example_path;
            this.created_at = init.created_at ?? new Date();
            this.is_delete = init.is_delete ?? '0';
        }
    }
}
