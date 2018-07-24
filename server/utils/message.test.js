const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message', () => {
        expect(generateMessage('tino', 'hello')).toMatchObject({
            from: 'tino',
            text: 'hello'
        });
    });
});