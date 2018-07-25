const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message', () => {
        expect(generateMessage('tino', 'hello')).toMatchObject({
            from: 'tino',
            text: 'hello'
        });
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        let coords = generateLocationMessage("tino", "1", "2");
        expect(coords.from).toBe('tino');
        expect(coords.url).toBe('https://www.google.com/maps?q=1,2');
        expect(typeof coords.createdAt).toBe('number');
    });
});