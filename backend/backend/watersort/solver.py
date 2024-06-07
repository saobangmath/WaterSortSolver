from collections import defaultdict 

"""
    Bottle have:  
    1. capacity which is the maximum capacity of waters inside bottles 
    2. waters array store the waters from bottom to top
"""
class Bottle: 
    def __init__(self, capacity: int, waters: list): 
        self.capacity = capacity 
        self.waters = waters

    def __repr__(self) -> str:
        return ",".join([water for water in self.waters])

    def __eq__(self, value: object) -> bool:
        if isinstance(value, Bottle): 
            return False 

        bottle = Bottle(value)
        if self.capacity != bottle.capacity:  
            return False

        if len(self.waters) != len(bottle.waters): 
            return False 
 
        return len([_ for _ in range(len(self.waters)) if self.waters[_] != bottle.waters[_]]) == 0

    def clone(self):
        waters = [water for water in self.waters]
        bottle = Bottle(capacity = self.capacity,waters = waters)
        return bottle

    def remove(self) -> bool: 
        if len(self.waters) > 0: 
            self.waters.pop(-1) 
            return True
        return False

    def add(self, water: str) -> bool: 
        if len(self.waters) < self.capacity:  
            if len(self.waters) == 0 or self.waters[-1] == water: 
                self.waters.append(water)
                return True
            
        return False  

    def is_same_water(self) -> bool:
        same = True 
        for i in range(len(self.waters)):
            if self.waters[i] != self.waters[0]:
                same = False
                break 
        return same  

"""
    represent the state of the game  
"""
class GameState(): 
    def __init__(self) -> None:
        self.bottles = []

    def __repr__(self) -> str:
        st = ""
        for bottle in self.bottles:
            st += bottle.__repr__() + "|"
        return st 
    
    def __hash__(self) -> int:
        return hash(self.__repr__())
     
    def clone(self):
        gameState = GameState()
        for bottle in self.bottles:
            gameState.append(bottle.clone())
    
    def add_bottle(self, bottle: Bottle):
        self.bottles.append(bottle)

    def is_end_state(self):
        for bottle in self.bottles:
            if not bottle.is_same_water():
                return False
        return True 

    def solve():
        seen = defaultdict(lambda: False)
