namespace SpriteKind {
    export const Cursor = SpriteKind.create()
    export const Localitation = SpriteKind.create()
    export const Decoration = SpriteKind.create()
    export const Cursor_Place = SpriteKind.create()
    export const villager = SpriteKind.create()
    export const Text = SpriteKind.create()
}
spriteutils.onSpriteKindUpdateInterval(SpriteKind.villager, 5000, function (sprite) {
    MoveVillager = randint(0, 10)
    if (MoveVillager == 0) {
        Villager.setImage(assets.image`Villager`)
    } else if (MoveVillager == 10) {
        Villager.setImage(assets.image`Villager Right`)
    }
})
function Create_Villager (Create: boolean, x: number, y: number) {
    if (Create) {
        Villager = sprites.create(assets.image`Villager`, SpriteKind.villager)
        tiles.placeOnTile(Villager, tiles.getTileLocation(x, y))
        Villager.ay = 5000
    }
}
function Update_Inventory (Block: number, num: number) {
    if (Block == 1) {
        _Dirt += num
    } else if (Block == 2) {
        _Wood += num
    } else if (Block == 3) {
        _Rock += num
    }
}
function Clear_Inventory () {
    Selected_Block = 0
    BLOCKCOUNT = 4
    _Dirt = 0
    _Wood = 0
    _Rock = 0
}
function OpenCrafts () {
    Move = 0
    blockMenu.setControlsEnabled(true)
    blockMenu.showMenu(["Exit", "Next>"], MenuStyle.Grid, MenuLocation.BottomHalf)
    if (Move == 0) {
        Move = 1
        PLAYER1.follow(X, 100)
    } else {
        Move = 0
        PLAYER1.follow(X, 0)
    }
}
function Mine () {
    tiles.setTileAt(CursorPlace.tilemapLocation(), assets.tile`transparency16`)
    tiles.setWallAt(CursorPlace.tilemapLocation(), false)
}
function Arrangements () {
    for (let value of tiles.getTilesByType(assets.tile`Dirt`)) {
        if (tiles.tileIs(tiles.locationInDirection(value, CollisionDirection.Top), assets.tile`transparency16`)) {
            tiles.setTileAt(value, assets.tile`Grass`)
        }
    }
    for (let value of tiles.getTilesByType(assets.tile`Grass`)) {
        if (tiles.tileIs(tiles.locationInDirection(value, CollisionDirection.Top), assets.tile`Grass`) || tiles.tileIs(tiles.locationInDirection(value, CollisionDirection.Top), assets.tile`Dirt`)) {
            tiles.setTileAt(value, assets.tile`Dirt`)
        }
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    PLAYER1.setImage(assets.image`Player Right`)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    PLAYER1.setImage(assets.image`Player`)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tiles.tileIs(CursorPlace.tilemapLocation(), assets.tile`transparency16`)) {
        Place_Block()
    } else if (tiles.tileIs(CursorPlace.tilemapLocation(), assets.tile`BedRoock`)) {
    	
    } else if (tiles.tileIs(CursorPlace.tilemapLocation(), assets.tile`Grass`) || tiles.tileIs(CursorPlace.tilemapLocation(), assets.tile`Dirt`)) {
        Update_Inventory(1, 1)
        Mine()
    } else if (tiles.tileIs(CursorPlace.tilemapLocation(), assets.tile`wood`)) {
        Update_Inventory(2, 1)
        Mine()
        if (Recepies == 1) {
            Recepies = 0
            Notification.notify("New Recepies!", 2)
        }
    } else if (tiles.tileIs(CursorPlace.tilemapLocation(), assets.tile`Rock`)) {
        Update_Inventory(3, 1)
        Mine()
    } else {
        Mine()
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Move == 0) {
        Move = 1
        PLAYER1.follow(X, 100)
    } else {
        Move = 0
        PLAYER1.follow(X, 0)
    }
})
function Place_Block () {
    if (Selected_Block == 1) {
        if (_Dirt > 0) {
            Update_Inventory(1, -1)
            tiles.setTileAt(CursorPlace.tilemapLocation(), assets.tile`Dirt`)
            tiles.setWallAt(CursorPlace.tilemapLocation(), true)
        }
    } else if (Selected_Block == 2) {
        if (_Wood > 0) {
            Update_Inventory(2, -1)
            tiles.setTileAt(CursorPlace.tilemapLocation(), assets.tile`wood`)
            tiles.setWallAt(CursorPlace.tilemapLocation(), false)
        }
    } else if (Selected_Block == 3) {
        if (_Rock > 0) {
            Update_Inventory(3, -1)
            tiles.setTileAt(CursorPlace.tilemapLocation(), assets.tile`Rock`)
            tiles.setWallAt(CursorPlace.tilemapLocation(), true)
        }
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.villager, function (sprite, otherSprite) {
    if (controller.A.isPressed()) {
        OpenCrafts()
    }
})
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Move == 0) {
        Selected_Block += 1
        if (Selected_Block > BLOCKCOUNT) {
            Selected_Block = 1
        }
    }
})
function Create_Ore () {
    for (let value of tiles.getTilesByType(assets.tile`Roc`)) {
        Ore = randint(0, 20)
        if (Ore > 19) {
            tiles.setTileAt(value, assets.tile`Diamond Ore`)
        } else if (Ore > 16) {
            tiles.setTileAt(value, assets.tile`Gold Ore`)
        } else if (Ore > 14) {
            tiles.setTileAt(value, assets.tile`Iron Ore`)
        } else if (Ore > 10) {
            tiles.setTileAt(value, assets.tile`Coal Ore`)
        }
    }
}
spriteutils.onSpriteKindUpdateInterval(SpriteKind.Cursor_Place, 100, function (sprite) {
    if (!(tiles.tileIs(CursorPlace.tilemapLocation(), assets.tile`transparency16`))) {
        sprite.setImage(assets.image`Cursor`)
    } else {
        if (Selected_Block == 1) {
            if (_Dirt > 0) {
                sprite.setImage(assets.image`Dirt`)
            }
        } else if (Selected_Block == 2) {
            if (_Wood > 0) {
                sprite.setImage(assets.image`Wood`)
            }
        } else if (Selected_Block == 3) {
            if (_Rock > 0) {
                sprite.setImage(assets.image`Rock`)
            }
        } else {
            sprite.setImage(assets.image`Cursor`)
        }
    }
})
blockMenu.onMenuOptionSelected(function (option, index) {
    if (option == "Exit") {
        blockMenu.setControlsEnabled(false)
        Move = 1
        if (Move == 0) {
            Move = 1
            PLAYER1.follow(X, 100)
        } else {
            Move = 0
            PLAYER1.follow(X, 0)
        }
    }
})
let Ore = 0
let BLOCKCOUNT = 0
let Selected_Block = 0
let _Rock = 0
let _Wood = 0
let _Dirt = 0
let Villager: Sprite = null
let MoveVillager = 0
let Move = 0
let CursorPlace: Sprite = null
let X: Sprite = null
let PLAYER1: Sprite = null
let Recepies = 0
blockMenu.setControlsEnabled(false)
info.setLife(8)
spriteutils.setConsoleOverlay(true)
Clear_Inventory()
Recepies = 1
scene.setBackgroundColor(9)
tiles.setCurrentTilemap(tilemap`nivel6`)
Create_Ore()
Create_Villager(true, 9, 10)
PLAYER1 = sprites.create(assets.image`Player`, SpriteKind.Player)
PLAYER1.ay = 5000
let Cursor = sprites.create(assets.image`CursorMouse`, SpriteKind.Cursor)
X = sprites.create(assets.image`Xlocalitation`, SpriteKind.Localitation)
Cursor.setStayInScreen(true)
CursorPlace = sprites.create(assets.image`Cursor`, SpriteKind.Cursor_Place)
scene.cameraFollowSprite(PLAYER1)
controller.moveSprite(Cursor)
PLAYER1.follow(X, 100)
Cursor.setFlag(SpriteFlag.GhostThroughWalls, true)
Move = 1
let Bar = sprites.create(assets.image`myImage`, SpriteKind.Decoration)
Bar.setFlag(SpriteFlag.RelativeToCamera, true)
Bar.setPosition(78, 96)
forever(function () {
    Arrangements()
    if (PLAYER1.isHittingTile(CollisionDirection.Bottom) && PLAYER1.y > CursorPlace.y && Move == 1) {
        PLAYER1.vy += -5000
    }
    tiles.placeOnTile(CursorPlace, tiles.locationInDirection(Cursor.tilemapLocation(), CollisionDirection.Bottom))
    X.setPosition(CursorPlace.x, PLAYER1.y)
})
