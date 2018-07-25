const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
    let users;
    let seed;

    beforeEach(() => {
        users = new Users();
        seed = [{
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        }, {
            id: '2',
            name: 'Jen',
            room: "React Course"
        }, {
            id: '3',
            name: 'Tino',
            room: 'Node Course'
        }];
        users.users = seed;
    });

    it('should return names for node course', () => {
        let userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Mike', 'Tino']);
    });

    it('should remove a user', () => {
        expect(users.removeUser(seed[0].id)).toEqual(seed[0]);
        expect(users.users.length).toBe(seed.length-1);
    });

    it('should NOT remove a user', () => {
        expect(users.removeUser('0')).toBe(undefined);
        expect(users.users.length).toBe(seed.length);
    });

    it('should get the user', () => {
        expect(users.getUser(seed[0].id)).toEqual(seed[0]);
    });

    it('should NOT find a user', () => {
        expect(users.removeUser('0')).toBe(undefined);
    });
});