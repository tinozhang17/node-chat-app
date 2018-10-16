class Rooms {
    constructor () {
        this.rooms = {};
    }

    updateRoom (room, action) {
        switch (action) {
            case "INC":
                this.rooms[room] = this.rooms[room] + 1 || 1;
                break;
            case "DEC":
                this.rooms[room] = this.rooms[room] - 1 || 0;
                if (!this.rooms[room]) {
                    delete this.rooms[room];
                }
                break;
        }
    }

    getCurrentRooms () {
        return Object.keys(this.rooms);
    }
}

module.exports = {Rooms};