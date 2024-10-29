class Room:
    def __init__(self,room_id):
        self.id = room_id
        self.p1 = None
        self.p2 = None
    
    def add_player(self,player):
        if self.is_full() is True:
            raise Exception("Room is full")
        if self.p1 is None:
            self.p1 = player
        elif self.p2 is None:
            self.p2 = player

    def is_full(self):
        if self.p1 is not None and self.p2 is not None:
            return True
        return False
