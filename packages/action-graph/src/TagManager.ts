export default class TagManager {
    private tags: {[key: string]: string[]} = {}

    constructor() {}

    public getTag(tag: string): string[] {
        if (!this.tags[tag]) {
            this.tags[tag] = [];
        }
        return this.tags[tag];
    }

    public addToTags(tags: string[], value: string) {
        tags.forEach(tag => this.getTag(tag).push(value));
    }

    public removeFromTags(tags: string[], value: string) {
        tags.forEach(tag => {
            const values = this.getTag(tag);
            this.tags[tag] = values.filter(val => val !== value);
        });
    }
}