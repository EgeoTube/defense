namespace SpriteKind {
    export const Cursor = SpriteKind.create()
    export const Gem = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (altGame == 0) {
        if (attacked == false) {
            music.zapped.play()
            info.changeLifeBy(-1)
            otherSprite.destroy()
            mySprite.setImage(assets.image`PlayerHurt`)
            attacked = true
            info.startCountdown(6)
        }
    }
})
scene.onOverlapTile(SpriteKind.Projectile, assets.tile`Campfire`, function (sprite, location) {
    if (altGame == 1) {
        sprite.destroy(effects.fire, 500)
        music.baDing.play()
        MGScore += 1
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    music.pewPew.play()
    game.setDialogCursor(assets.image`PlayerHurt`)
    game.splash("GAME OVER", "Continue for Results")
    game.splash("Minigame Score", MGScore)
    game.reset()
})
info.onLifeZero(function () {
    game.setDialogCursor(assets.image`PlayerHurt`)
    game.splash("GAME OVER", "Continue for Results")
    game.splash("Day of Death", "Day " + day)
    game.splash("Wood Collected", info.score())
    game.splash("Tents Used", tentsUsed)
    game.reset()
})
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (altGame == 0) {
        music.jumpUp.play()
        if (Math.percentChance(50)) {
            game.setDialogCursor(assets.image`Player`)
        } else {
            game.setDialogCursor(assets.image`Monster`)
        }
        game.splash("PAUSED", "Day " + day)
        music.jumpDown.play()
    } else {
        music.jumpUp.play()
        if (Math.percentChance(50)) {
            game.setDialogCursor(assets.image`Player`)
        } else {
            game.setDialogCursor(assets.image`Monster`)
        }
        game.splash("PAUSED", "Playing Monster Evade")
        music.jumpDown.play()
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (altGame == 0) {
        if (itemHeld == 0) {
            cursor.setImage(assets.image`Pickaxe`)
            itemHeld = 1
        } else if (itemHeld == 1) {
            cursor.setImage(img`
                . . . f f . f . 
                . . f 4 f f f . 
                . f 4 5 f 4 f . 
                . f 4 5 5 4 f . 
                . f 4 4 4 4 f . 
                . f f f f f f . 
                f e e e e e e f 
                . f f f f f f . 
                `)
            itemHeld = 2
        } else if (itemHeld == 2) {
            cursor.setImage(assets.image`WoodBlock`)
            itemHeld = 0
        }
    }
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (tiles.tileAtLocationEquals(location, assets.tile`Tent`)) {
        if (Math.percentChance(50)) {
            game.showLongText("You went in and got some good rest! (1 Life)", DialogLayout.Center)
            info.changeLifeBy(1)
        } else {
            game.showLongText("You were ambushed by a monster! (-1 Life)", DialogLayout.Center)
            info.changeLifeBy(-1)
        }
        tentsUsed += 1
        tiles.setTileAt(location, assets.tile`Grass`)
        tiles.setWallAt(location, false)
    }
})
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    if (altGame == 0) {
        if (!(tiles.tileAtLocationEquals(location, assets.tile`transparency16`))) {
            if (tiles.tileAtLocationEquals(location, assets.tile`Campfire`)) {
                sprite.destroy()
                tiles.setTileAt(location, assets.tile`Grass`)
                tiles.setWallAt(location, false)
            } else {
                if (cooldown > 0) {
                    cooldown += -1
                } else {
                    tiles.setTileAt(location, assets.tile`Grass`)
                    tiles.setWallAt(location, false)
                    cooldown = 100
                }
            }
        }
    }
})
info.onCountdownEnd(function () {
    attacked = false
    mySprite.setImage(assets.image`Player`)
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (altGame == 0) {
        if (itemHeld == 0) {
            if (info.score() > 0) {
                if (tiles.tileAtLocationEquals(cursor.tilemapLocation(), assets.tile`Grass`)) {
                    tiles.setTileAt(cursor.tilemapLocation(), assets.tile`Wood`)
                    tiles.setWallAt(cursor.tilemapLocation(), true)
                    info.changeScoreBy(-1)
                }
            }
        } else if (itemHeld == 1) {
            if (tiles.tileAtLocationEquals(cursor.tilemapLocation(), assets.tile`Tree`)) {
                info.changeScoreBy(randint(4, 6))
                tiles.setTileAt(cursor.tilemapLocation(), assets.tile`Grass`)
                tiles.setWallAt(cursor.tilemapLocation(), false)
            } else if (tiles.tileAtLocationEquals(cursor.tilemapLocation(), assets.tile`Wood`)) {
                info.changeScoreBy(1)
                tiles.setTileAt(cursor.tilemapLocation(), assets.tile`Grass`)
                tiles.setWallAt(cursor.tilemapLocation(), false)
            } else if (tiles.tileAtLocationEquals(cursor.tilemapLocation(), assets.tile`Campfire`)) {
                info.changeScoreBy(5)
                tiles.setTileAt(cursor.tilemapLocation(), assets.tile`Grass`)
                tiles.setWallAt(cursor.tilemapLocation(), false)
            }
        } else if (itemHeld == 2) {
            if (info.score() > 10) {
                if (tiles.tileAtLocationEquals(cursor.tilemapLocation(), assets.tile`Grass`)) {
                    tiles.setTileAt(cursor.tilemapLocation(), assets.tile`Campfire`)
                    tiles.setWallAt(cursor.tilemapLocation(), true)
                    info.changeScoreBy(-10)
                }
            }
        }
    }
})
sprites.onOverlap(SpriteKind.Cursor, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (controller.A.isPressed()) {
        if (itemHeld == 1) {
            otherSprite.destroy()
            music.smallCrash.play()
        }
    }
})
function start () {
    if (game.ask("A = Play", "B = How To Play")) {
        if (game.ask("A = Survival", "B = Minigame")) {
            cursor = sprites.create(assets.image`WoodBlock`, SpriteKind.Cursor)
            soulGem = sprites.create(img`
                . . . . . . . . . . . . . . . . 
                . . . . . . . c c . . . . . . . 
                . . . . . . c b b c . . . . . . 
                . . . . . c b b 1 b c . . . . . 
                . . . . c b b b 1 1 b c . . . . 
                . . . c b b b d d 1 1 b c . . . 
                . . . c b d d b b d d b c . . . 
                . . f b b d b d d b 1 1 b c . . 
                . . f b d b d d d d b d b c . . 
                . . f b d b d d d d b d b c . . 
                . . f b b d b d d b d b b c . . 
                . . . f b d d b b d d b c . . . 
                . . . f b b b d d b b b c . . . 
                . . . . f f b b b b f f . . . . 
                . . . . . . f f f f . . . . . . 
                . . . . . . . . . . . . . . . . 
                `, SpriteKind.Gem)
            mySprite = sprites.create(assets.image`Player`, SpriteKind.Player)
            controller.moveSprite(cursor)
            mySprite.follow(cursor, 98)
            tiles.setCurrentTilemap(tilemap`Arena`)
            cursor.setFlag(SpriteFlag.GhostThroughWalls, true)
            cursor.setStayInScreen(true)
            tiles.placeOnTile(cursor, tiles.getTileLocation(24, 38))
            tiles.placeOnTile(mySprite, tiles.getTileLocation(24, 38))
            tiles.placeOnTile(soulGem, tiles.getTileLocation(randint(1, 46), randint(1, 46)))
            scene.cameraFollowSprite(mySprite)
            cooldown = 0
            itemHeld = 0
            attacked = false
            day = 0
            tentsUsed = 0
            info.setLife(3)
            info.setScore(0)
        } else {
            altGame = 1
            MGScore = 0
            mySprite = sprites.create(assets.image`Player`, SpriteKind.Player)
            controller.moveSprite(mySprite, 0, 100)
            tiles.setCurrentTilemap(tilemap`Minigame`)
            tiles.placeOnTile(mySprite, tiles.getTileLocation(7, 3))
            music.playMelody("G - E B - G - C5 ", 360)
        }
    } else {
        game.showLongText("You can use the item you are holding using (A)/[Space]. You can also switch items using (B)/[Enter]. Monsters can be defeated with campfires or a pickaxe but be careful, they can break blocks! Do you have what it takes to survive?", DialogLayout.Full)
        game.showLongText("In Minigame Mode, You try to avoid monsters coming at you by going up or down! Try to avoid as many monsters as possible!", DialogLayout.Full)
        start()
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Gem, function (sprite, otherSprite) {
    if (Math.percentChance(25)) {
        info.changeLifeBy(1)
    } else {
        info.changeScoreBy(5)
    }
    music.beamUp.play()
    tiles.placeOnTile(soulGem, tiles.getTileLocation(randint(1, 30), randint(1, 30)))
})
let projectile: Sprite = null
let monster: Sprite = null
let soulGem: Sprite = null
let cooldown = 0
let cursor: Sprite = null
let itemHeld = 0
let tentsUsed = 0
let day = 0
let MGScore = 0
let mySprite: Sprite = null
let attacked = false
let altGame = 0
music.setVolume(200)
altGame = 0
if (Math.percentChance(50)) {
    game.setDialogCursor(assets.image`Player`)
} else {
    game.setDialogCursor(assets.image`Monster`)
}
game.setDialogFrame(img`
    . f f f f f f f f f f f f f . 
    f f e e e e e e e e e e e f f 
    f e f 4 4 4 4 4 4 4 4 4 f e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e 4 4 4 4 4 4 4 4 4 4 4 e f 
    f e f 4 4 4 4 4 4 4 4 4 f e f 
    f f e e e e e e e e e e e f f 
    . f f f f f f f f f f f f f . 
    `)
game.splash("Defense!", "EgeoTube")
start()
game.onUpdateInterval(20000, function () {
    if (altGame == 0) {
        day += 1
        for (let value of tiles.getTilesByType(assets.tile`Enemy Spawn`)) {
            monster = sprites.create(assets.image`Monster`, SpriteKind.Enemy)
            tiles.placeOnTile(monster, value)
            monster.follow(mySprite, 20)
        }
        music.powerDown.play()
    }
})
game.onUpdateInterval(750, function () {
    if (altGame == 1) {
        projectile = sprites.createProjectileFromSide(assets.image`Monster`, 50, 0)
        tiles.placeOnTile(projectile, tiles.getTileLocation(0, randint(1, 6)))
    }
})
