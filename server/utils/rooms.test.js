const {Rooms} = require('./rooms');
const expect = require('expect');

describe('Rooms', () => {
    let rooms;

    beforeEach(() => {
        rooms = new Rooms();
        rooms.rooms = {'r1': 1, 'r2': 2};
    });

    it('should add a new room', () => {
        rooms.updateRoom('r3', 'INC');
        expect(rooms.rooms).toEqual({'r1': 1, 'r2': 2, 'r3': 1});
    });

    it('should increase the room user count', () => {
        rooms.updateRoom('r2', 'INC');
        expect(rooms.rooms).toEqual({'r1': 1, 'r2': 3});
    });

    it('should remove a room with no user', () => {
        rooms.updateRoom('r1', 'DEC');
        expect(rooms.rooms).toEqual({'r2': 2});
    });

    it('should get the current rooms as array', () => {
        expect(rooms.getCurrentRooms()).toEqual(['r1', 'r2']);
    });
});