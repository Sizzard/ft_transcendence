class Room:
    def __init__(self,room_id, requiredP1 = None, requiredP2 = None):
        self.id = room_id
        self.requiredP1 = requiredP1
        self.requiredP2 = requiredP2
        self.p1 = None
        self.p2 = None
    
    def add_player(self,player_id):
        if self.is_full() is True:
            return "0"
        if self.requiredP1 is not None or self.requiredP2 is not None:
            if self.requiredP1 is player_id:
                self.p1 = player_id
                return "1"
            elif self.requiredP2 is player_id:
                self.p2 = player_id
                return "2"
            else:
                return "0"
        if self.p1 is None:
            self.p1 = player_id
            return "1"
        elif self.p2 is None:
            self.p2 = player_id
            return "2"

    def is_full(self):
        if self.p1 is not None and self.p2 is not None:
            return True
        return False
