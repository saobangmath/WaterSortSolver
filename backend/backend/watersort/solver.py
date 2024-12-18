from collections import defaultdict 
from queue import LifoQueue

"""
    Bottle have:  
    1. capacity which is the maximum capacity of waters inside bottles 
    2. waters array store the waters from bottom to top
"""
class Bottle: 
    def __init__(self, capacity: int, waters: list[str]): 
        self.capacity = capacity 
        self.waters = [water for water in waters]

    def __repr__(self) -> str:
        return ",".join([water for water in self.waters])

    def clone(self):
        bottle = Bottle(capacity = self.capacity, waters = self.waters)
        return bottle
    
    def pop_water_on_top(self) -> bool:
        if self.waters == []:
            return False
    
        self.waters.pop()
        return True 

    def can_add_water_on_top(self, water: str):
        if self.is_full():
            return False 
        
        return self.is_empty() or self.waters[-1] == water 
    
    def add_water_on_top(self, water: str): 
        self.waters.append(water)

    """
        dry-run to check if we can pour water from current bottle to the other
    """
    def can_pour_to(self, to_bottle) -> bool:
        if self.is_same_water():
            if to_bottle.is_empty():
                return False 
            
            if self.is_empty() or self.is_full():
                return False 
        
        if not to_bottle.can_add_water_on_top(self.waters[-1]):
            return False 
        
        waterCnt = 0
        for water in self.waters[::-1]:
            if water == self.waters[-1]:
                waterCnt += 1

        return waterCnt + len(to_bottle.waters) <= to_bottle.capacity 

    """
        pour water to to_bottle
        return True if the state of the current bottle changed aft the operation
        else return False 
    """
    def pour_to(self, to_bottle) -> bool: 
        if not self.can_pour_to(to_bottle):
            return False 
        
        while len(self.waters) > 0 and to_bottle.can_add_water_on_top(self.waters[-1]):
            to_bottle.add_water_on_top(self.waters[-1])
            assert(self.pop_water_on_top())

        return True 

    def is_same_water(self) -> bool:
        for i in range(len(self.waters)):
            if self.waters[i] != self.waters[0]:
                return False
            
        return True
    
    def is_full(self) -> bool:  
        return len(self.waters) == self.capacity  

    def is_empty(self) -> bool: 
        return len(self.waters) == 0  

"""
    represent the state of the game  
"""
class GameState(): 
    def __init__(self) -> None:
        self.bottles = []
        self.plan = None 

    def __repr__(self) -> str:
        st = ""
        for bottle in self.bottles:
            st += bottle.__repr__() + "\n"
        return st 
    
    def __eq__(self, other):
        if not isinstance(other, GameState):
            return False  
        
        return self.__repr__() == other.__repr__()
    
    def __hash__(self) -> int:
        return hash(self.__repr__())
     
    def clone(self):
        gameState = GameState()
        for bottle in self.bottles:
            gameState.add_bottle(bottle.clone())

        return gameState
    
    def add_bottle(self, bottle: Bottle):
        self.bottles.append(bottle)

    def is_end_state(self):
        for bottle in self.bottles:
            if not bottle.is_same_water():
                return False
        
        waterSet = set()
        for bottle in self.bottles: 
            if not bottle.is_empty() and not bottle.is_full():
                water = bottle.waters[-1]
                if water in waterSet: 
                    return False 
                waterSet.add(water)

        return True 

    def solve(self):
        back_dict = defaultdict(lambda: None) 
        dead_nodes = defaultdict(lambda: None)
        initialState = self 
        back_dict[initialState] = [initialState, (0,0)]
        queue = LifoQueue()
        queue.put(initialState)
        last_state = None 
        while not queue.empty():
            cur_state: GameState = queue.get()
            if cur_state.is_end_state():
                last_state = cur_state
                break 
            
            len_bottle = len(cur_state.bottles)
            can_move: bool = False
            for from_id in range(len_bottle):
                for to_id in range(len_bottle):
                    if from_id == to_id:
                        continue
                    
                    if not cur_state.bottles[from_id].can_pour_to(cur_state.bottles[to_id]):
                        continue

                    next_state: GameState = cur_state.clone()
                    if next_state.bottles[from_id].pour_to(next_state.bottles[to_id]):
                        if back_dict[next_state] != None:
                            continue 
                        
                        if dead_nodes[next_state]:
                            continue 

                        back_dict[next_state] = [cur_state, (from_id, to_id)]
                        queue.put(next_state)
                        can_move = True
            
            if not can_move: 
                dead_nodes[cur_state] = True 
                del(dead_nodes[cur_state])

        steps = []
        while True: 
            back = back_dict[last_state]
            prev_state, step = back[0], back[1]
            if prev_state == last_state:
                break 
            
            last_state = prev_state
            steps.append(step)
        
        self.plan = steps[::-1]
        

if __name__ ==  "__main__":
    game = GameState()
    game.add_bottle(Bottle(4, ["XanhLa", "XanhBlue", "XanhBlue", "XanhNhat"]))
    game.add_bottle(Bottle(4, ["Vang", "XanhLa", "XanhBlueNhat", "Nau"]))
    game.add_bottle(Bottle(4, ["XanhBlue", "Do", "Xam", "Cam"]))
    game.add_bottle(Bottle(4, ["XanhBlue", "Hong", "Vang", "Do"]))
    game.add_bottle(Bottle(4, ["Hong", "Cam", "Vang", "Do"]))
    game.add_bottle(Bottle(4, ["XanhNhat", "Nau", "Tim", "Cam"]))
    game.add_bottle(Bottle(4, ["XanhNhat", "Tim", "Vang", "Do"]))
    game.add_bottle(Bottle(4, ["Tim", "XanhBlueNhat", "Cam", "XanhLa"]))
    game.add_bottle(Bottle(4, ["XanhNhat", "XanhLaNhat", "Xam", "Tim"]))
    game.add_bottle(Bottle(4, ["Hong", "XanhBlueNhat", "Nau", "XanhLaNhat"]))
    game.add_bottle(Bottle(4, ["Xam", "XanhBlueNhat", "XanhLaNhat", "Xam"]))
    game.add_bottle(Bottle(4, ["XanhLaNhat", "Hong", "Nau", "XanhLa"]))
    game.add_bottle(Bottle(4, []))
    game.add_bottle(Bottle(4, []))
    # game.add_bottle(Bottle(4, ["Brown", "Brown", "Yellow", "Pink"]))
    # game.add_bottle(Bottle(4, ["Red", "Purple", "Red", "Green1"]))
    # game.add_bottle(Bottle(4, ["Pink", "Purple", "Blue", "Orange"]))
    # game.add_bottle(Bottle(4, ["Purple", "Green", "Orange", "Brown"]))
    # game.add_bottle(Bottle(4, ["Green1", "Brown", "Blue", "Yellow"]))
    # game.add_bottle(Bottle(4, ["Green1", "Green1", "Green", "Blue"]))
    # game.add_bottle(Bottle(4, ["Red", "Pink", "Pink", "Green"]))
    # game.add_bottle(Bottle(4, ["Orange", "Green", "Blue", "Orange"]))
    # game.add_bottle(Bottle(4, ["Gray", "Yellow", "Gray", "Yellow"]))
    # game.add_bottle(Bottle(4, ["Gray", "Red", "Gray", "Purple"]))
    # game.add_bottle(Bottle(4, []))
    # game.add_bottle(Bottle(4, []))
    game.solve()
    print(game.plan)