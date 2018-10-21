//=============================================================================
// SkillTreesSystem.js
//=============================================================================

/*:
 * @plugindesc v1.1 Basic skill trees in a separate scene.
 *
 * @author SomeFire
 *
 * @param ---General---
 * @default
 *
 * @param Skill points per level
 * @parent ---General---
 * @type number
 * @min 0
 * @desc Amount of skill points given per level.
 * Use 0 if you wish to have no limit.
 * @default 0
 *
 * @param Trees in a row
 * @parent ---General---
 * @type number
 * @min 1
 * @desc Amount of skill trees shown at the same time on the tree select window.
 * @default 3
 *
 * @param Skills in a row
 * @parent ---General---
 * @type number
 * @min 1
 * @desc Amount of skills that can be placed in a single row of the skill tree window.
 * @default 7
 *
 * @param Margin for skill cursor
 * @parent ---General---
 * @type boolean
 * @on Big
 * @off Small
 * @desc Use big cursor for skill icons with opaque background.
 * Use small cursor for icons with transparent background.
 * @default true
 *
 * @param ---Text---
 * @default
 *
 * @param Button value
 * @parent ---Text---
 * @desc Text for menu button or other way you open skill scene.
 * @default Skill Trees
 *
 * @param Earning points text
 * @parent ---Text---
 * @desc Text to describe how much skill points is earned.
 * @default SP earned
 *
 * @param No trees text
 * @parent ---Text---
 * @desc Text to describe absence of any skill tree.
 * @default No skill trees available.
 *
 * @param Free points text
 * @parent ---Text---
 * @desc Text for free skill points to show in the skill description window.
 * @default SP:
 *
 * @param Tree points text
 * @parent ---Text---
 * @desc Text for skill points ised in the tree to show in the skill description window.
 * @default SP in %1:
 *
 * @param Requirements text
 * @parent ---Text---
 * @desc Text for skill requirements to show in the skill description window.
 * @default Requirements:
 *
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 *
 * To use this plugin you need to create your own skill trees in the
 * SkillTreesConfig.js file and add trees to the actors when the game starts.
 *
 *     actor.setSkillTrees(skillTreesObjectId);
 *
 * To add tree or skill points use next code:
 *
 *     actor.addTree(skillTree);
 *     actor.addTreesPoints(points);
 *
 * See SkillTreesConfig.js for details.
 *
 * ============================================================================
 * Terms of use
 * ============================================================================
 *
 * Free to use in any RPG Maker MV project including commercial.
 * Please, credit "SomeFire" and let me know about your game.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.0:
 * - Finished plugin!
 *
 * Version 1.1:
 * - Possibility to add trees during the game.
 * - Added API section.
 *
 * Version 1.2:
 * - Added item requirement.
 * - Added game variable and game switch requirements.
 * - Added on skill learn action to change game variables.
 * - Colored requirements.
 * - Skill points can be received on level up.
 *
 */

//=============================================================================
// System Variables
//=============================================================================

var SkillTreesSystem = SkillTreesSystem || {};
SkillTreesSystem.Parameters = PluginManager.parameters('SkillTreesSystem');

/** Amount of skill points given per level. */
SkillTreesSystem.pointsPerLevel = Number(SkillTreesSystem.Parameters['Skill points per level']);

/** Amount of trees shown on the window at a time. */
SkillTreesSystem.treeWindowMaxCols = Number(SkillTreesSystem.Parameters['Trees in a row']);

/** Amount of skill slots in a single row. */
SkillTreesSystem.skillWindowMaxCols = Number(SkillTreesSystem.Parameters['Skills in a row']);

/** Use big cursor for skill icons with opaque background. Use small cursor for icons with transparent background. */
SkillTreesSystem.skillCursorMargin = eval(SkillTreesSystem.Parameters['Margin for skill cursor']);

/** Text for the menu button. */
SkillTreesSystem.buttonValue = String(SkillTreesSystem.Parameters['Button value']);

/** Text to describe how much skill points is earned. */
SkillTreesSystem._earnPointsText = String(SkillTreesSystem.Parameters['Earning points text']);

/** Text used to describe absence of any skill tree. */
SkillTreesSystem._noTreesText = String(SkillTreesSystem.Parameters['No trees text']);

/** Text for free skill points to show in the skill description window. */
SkillTreesSystem._freePointsText = String(SkillTreesSystem.Parameters['Free points text']);

/** Text for skill points ised in the tree to show in the skill description window. */
SkillTreesSystem._treePointsText = String(SkillTreesSystem.Parameters['Tree points text']);

/** Text for skill requirements to show in the skill description window. */
SkillTreesSystem._requirementsText = String(SkillTreesSystem.Parameters['Requirements text']);

/**
 * Text for free skill points to show in the skill description window.
 */
SkillTreesSystem.freePointsText = function() {
    return SkillTreesSystem._freePointsText + " ";
};

/**
 * Text for skill points ised in the tree to show in the skill description window.
 */
SkillTreesSystem.treePointsText = function(tree) {
    return SkillTreesSystem._treePointsText.format(tree.name) + " ";
};

/**
 * Text for skill requirements to show in the skill description window.
 */
SkillTreesSystem.requirementsText = function() {
    return SkillTreesSystem._requirementsText;
};

SkillTreesSystem.enabled = true;

SkillTreesSystem.isEnabled = function() {
    return this.enabled;
};

//-----------------------------------------------------------------------------
// Scene_SkillTrees
//
// The scene with hero's skill trees.

function Scene_SkillTrees() {
    this.initialize.apply(this, arguments);
}

Scene_SkillTrees.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SkillTrees.prototype.constructor = Scene_Menu;

Scene_SkillTrees.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_SkillTrees.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
  
    this._treesWindow = new Trees_Window(0, 0);
    this._treesWindow.setHandler('ok',     this.onTreeOk.bind(this));
    this._treesWindow.setHandler('cancel', this.popScene.bind(this));
    this._treesWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._treesWindow.setHandler('pageup',   this.previousActor.bind(this));
    this.addWindow(this._treesWindow);

    this._skillsWindow = new Skills_Window(0, this._treesWindow.windowHeight());
    this.addWindow(this._skillsWindow);
    this._skillsWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._skillsWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this._skillsWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._skillsWindow.setHandler('pageup',   this.previousActor.bind(this));
    this._treesWindow.setSkillsWindow(this._skillsWindow);

    this._descriptionWindow = new Description_Window(this._skillsWindow.windowWidth(), this._treesWindow.windowHeight());
    this.addWindow(this._descriptionWindow);
    this._treesWindow.setDescriptionWindow(this._descriptionWindow);
    this._skillsWindow.setDescriptionWindow(this._descriptionWindow);
};

Scene_SkillTrees.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this.refreshActor();
    this._treesWindow.refresh();
    this._skillsWindow.refresh();
    this._descriptionWindow.refresh();

    if (this._isSingleTreeActor())
        this._treesWindow.processOk();
};

Scene_SkillTrees.prototype.refreshActor = function() {
    var actor = this.actor();
    this._treesWindow.setActor(actor);
    this._skillsWindow.setActor(actor);
    this._descriptionWindow.setActor(actor);
};

Scene_SkillTrees.prototype.onActorChange = function() {
    this.refreshActor();
    this._treesWindow.activate();
    this._treesWindow.selectLast();

    if (this._isSingleTreeActor())
        this._treesWindow.processOk();
};

Scene_SkillTrees.prototype._isSingleTreeActor = function() {
    return this._actor && this._actor.skillTrees && this._actor.skillTrees.trees.length === 1;
};

Scene_SkillTrees.prototype.onTreeOk = function() {
    this._skillsWindow.activate();
    this._skillsWindow.selectLast();
};

Scene_SkillTrees.prototype.onItemOk = function() {
    var actor = this._descriptionWindow._actor;
    var tree = this._descriptionWindow._tree;
    var skill = this._descriptionWindow._skill;

    if (skill.isAvailableToLearn(actor, tree)) {
        skill.learn(actor, tree);
        this._skillsWindow.refresh();
        this._descriptionWindow.refresh();
    }

    this._skillsWindow.activate();
};

Scene_SkillTrees.prototype.onItemCancel = function() {
    Skills_Window._lastSelectedIndex[this._actor.actorId()][this._skillsWindow._tree.symbol] = this._skillsWindow.index();

    this._skillsWindow.deselect();
    this._treesWindow.activate();

    if (this._isSingleTreeActor())
        this._treesWindow.callHandler('cancel');
};

//-----------------------------------------------------------------------------
// Trees Window
//
// The window for selecting a skill tree on the abilities screen.

function Trees_Window() {
  this.initialize.apply(this, arguments);
}

Trees_Window._lastCommandSymbol = {};

Trees_Window.prototype = Object.create(Window_Command.prototype);
Trees_Window.prototype.constructor = Trees_Window;

Trees_Window.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());

    this._actor = null;
    this._skillsWindow = null;
    this._descriptionWindow = null;

    this.selectLast();
};

Trees_Window.prototype.setSkillsWindow = function(skillsWindow) {
    this._skillsWindow = skillsWindow;
};

Trees_Window.prototype.setDescriptionWindow = function(descriptionWindow) {
    this._descriptionWindow = descriptionWindow;
};

Trees_Window.prototype.windowWidth = function() {
  return Graphics.boxWidth;
};

Trees_Window.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Trees_Window.prototype.numVisibleRows = function() {
    return 1;
};

Trees_Window.prototype.maxCols = function() {
    if (this._actor && this._actor.skillTrees)
        return Math.min(this._actor.skillTrees.trees.length, SkillTreesSystem.treeWindowMaxCols);

    return 1;
};

Trees_Window.prototype.makeCommandList = function() {
    if (this._actor) {
        if (this._actor.skillTrees && this._actor.skillTrees.trees && this._actor.skillTrees.trees.length > 0) {
            for (let tree of this._actor.skillTrees.trees)
                this.addCommand(tree.name, tree.symbol, true);
        } else
            this.addCommand(SkillTreesSystem._noTreesText, null, false);
    }

    if (this._skillsWindow)
        this._skillsWindow.setSkillTree(this.currentSymbol());
};

Trees_Window.prototype.processOk = function() {
    Trees_Window._lastCommandSymbol[this._actor.actorId()] = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Trees_Window.prototype.selectLast = function(actor) {
    this.selectSymbol(actor ? Trees_Window._lastCommandSymbol[actor.actorId()] : null);
};

Trees_Window.prototype.select = function(index) {
    Window_Command.prototype.select.call(this, index);

    if (this._skillsWindow)
        this._skillsWindow.setSkillTree(this.currentSymbol());

    if (this._actor && this._descriptionWindow)
        this._descriptionWindow.showDescripion(this._actor.skillTrees ? this._actor.skillTrees.trees[index] : null);
};

Trees_Window.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.selectLast(actor);
    }
};

Trees_Window.prototype.itemTextAlign = function() {
    return 'center';
};

Trees_Window.prototype._createAllParts = function() {
    Window_Command.prototype._createAllParts.call(this);
    this._leftArrowSprite = new Sprite();
    this._rightArrowSprite = new Sprite();
    this.addChild(this._leftArrowSprite);
    this.addChild(this._rightArrowSprite);
};

Trees_Window.prototype._refreshArrows = function() {
    var w = this._width;
    var h = this._height;
    var p = 24; // arrow width
    var q = p/2; // arrow height
    var sx = 96+p;
    var sy = 0+p;
    this._leftArrowSprite.bitmap = this._windowskin;
    this._leftArrowSprite.anchor.x = 0.5;
    this._leftArrowSprite.anchor.y = 0.5;
    this._leftArrowSprite.setFrame(sx, sy+q, q, p);
    this._leftArrowSprite.move(q, h/2);
    this._rightArrowSprite.bitmap = this._windowskin;
    this._rightArrowSprite.anchor.x = 0.5;
    this._rightArrowSprite.anchor.y = 0.5;
    this._rightArrowSprite.setFrame(sx+q+p, sy+q, q, p);
    this._rightArrowSprite.move(w-q, h/2);
};

Trees_Window.prototype._updateArrows = function() {
    var tooManyItems = this.maxItems() > SkillTreesSystem.treeWindowMaxCols;

    this._leftArrowSprite.visible = this.isOpen() && this._leftArrowSprite && tooManyItems;
    this._rightArrowSprite.visible = this.isOpen() && this._rightArrowSprite && tooManyItems;
};

Trees_Window.prototype.cursorDown = function(wrap) {};
Trees_Window.prototype.cursorUp = function(wrap) {};

//-----------------------------------------------------------------------------
// Skills Window
//
// The window for selecting a skill on the abilities screen.

function Skills_Window() {
  this.initialize.apply(this, arguments);
}

Skills_Window._lastSelectedIndex = {};

Skills_Window.prototype = Object.create(Window_Selectable.prototype);
Skills_Window.prototype.constructor = Skills_Window;

Skills_Window.prototype.initialize = function(x, y) {
    Window_Selectable.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
    this._actor = null;
    this._tree = null;
    this._descriptionWindow = null;
};

Skills_Window.prototype.setDescriptionWindow = function(descriptionWindow) {
    this._descriptionWindow = descriptionWindow;
};

Skills_Window.prototype.maxItems = function() {
    return this._tree ? this._tree.skills.length : 0;
};

Skills_Window.prototype.maxCols = function() {
    return SkillTreesSystem.skillWindowMaxCols;
};

Skills_Window.prototype.windowWidth = function() {
    return Window_Base._iconWidth * SkillTreesSystem.skillWindowMaxCols + this.standardPadding() * 2 - 8;
};

Skills_Window.prototype.windowHeight = function() {
    return Graphics.boxHeight - this.fittingHeight(1);
};

Skills_Window.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this._tree = null;
        this.selectLast();
        this.refresh();
    }
};

Skills_Window.prototype.setSkillTree = function(symbol) {
    this._tree = this.findTree(symbol);
    this.refresh();
};

Skills_Window.prototype.findTree = function(symbol) {
    if (!symbol)
        return null;

    if (this._actor && this._actor.skillTrees) {
        var trees = this._actor.skillTrees.trees;

        for (var i = 0; i < trees.length; i++) {
            if (trees[i].symbol === symbol)
                return trees[i];
        }
    }

    return null;
};

Skills_Window.prototype.itemWidth = function() {
    return Window_Base._iconWidth;
};

Skills_Window.prototype.itemHeight = function() {
    return Window_Base._iconHeight;
};

Skills_Window.prototype.drawItem = function(treeObj, index) {
    var x = Window_Base._iconWidth * (index % SkillTreesSystem.skillWindowMaxCols);
    var y = Window_Base._iconHeight * Math.floor(index / SkillTreesSystem.skillWindowMaxCols);

    this.changePaintOpacity(treeObj.isEnabled(this._actor, this._tree));
    this.drawIcon(treeObj.iconId(), x, y);
    this.changePaintOpacity(1);

    if (treeObj instanceof Skill) {
        var size = this.contents.fontSize;
        this.contents.fontSize = Window_Base._iconHeight / 3;

        if (treeObj.currentLevel() === treeObj.maxLevel())
            var text = "MAX";
        else
            text = treeObj.currentLevel() + "/" + treeObj.maxLevel();

        this.drawText(text, x + 2, y + Window_Base._iconHeight / 4, Window_Base._iconWidth - 4, 'center');

        this.contents.fontSize = size;
    }
};

Skills_Window.prototype.drawAllItems = function() {
    if (!this._tree)
        return;

    this._tree.skills.forEach(function(item, idx) {
        if (item instanceof TreeObject)
            this.drawItem(item, idx);
    }, this);
};

Skills_Window.prototype.refresh = function() {
    if (this.contents) {
        this.contents.clear();
        this.drawAllItems();
    }
};

Skills_Window.prototype.select = function(index) {
    if (index !== -1 && (this._tree && !(this._tree.skills[index] instanceof Skill)))
        return;

    Window_Selectable.prototype.select.call(this, index);

    if (this._descriptionWindow)
        this._descriptionWindow.showDescripion(this._tree, this._tree ? this._tree.skills[index] : null);
};

Skills_Window.prototype.selectLast = function() {
    if (!this._actor || !this._tree) {
        this.deselect();

        return;
    }

    if (!Skills_Window._lastSelectedIndex[this._actor.actorId()])
        Skills_Window._lastSelectedIndex[this._actor.actorId()] = {};

    if (!Skills_Window._lastSelectedIndex[this._actor.actorId()][this._tree.symbol]) {
        for (let i = 0; i < this._tree.skills.length; i++) {
            if (this._tree.skills[i] instanceof Skill) {
                Skills_Window._lastSelectedIndex[this._actor.actorId()][this._tree.symbol] = i;
                break;
            }
        }
    }

    this.select(Skills_Window._lastSelectedIndex[this._actor.actorId()][this._tree.symbol]);
};

Skills_Window.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    rect.x = Window_Base._iconWidth * (index % SkillTreesSystem.skillWindowMaxCols);
    rect.y = Window_Base._iconHeight * Math.floor(index / SkillTreesSystem.skillWindowMaxCols);
    return rect;
};

Skills_Window.prototype.updateCursor = function() {
    if (this.isCursorVisible()) {
        var rect = this.itemRect(this.index());

        if (SkillTreesSystem.skillCursorMargin) {
            this.setCursorRect(rect.x + this.spacing() / 2, rect.y + this.spacing() / 2,
                rect.width + this.spacing(), rect.height + this.spacing());
        } else
            this.setCursorRect(rect.x + this.spacing(), rect.y + this.spacing(), rect.width, rect.height);
    } else
        this.setCursorRect(0, 0, 0, 0);

    /*
    if (this._cursorAll) {
        var allRowsHeight = this.maxRows() * this.itemHeight();
        this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
        this.setTopRow(0);
    } else if (this.isCursorVisible()) {
        var rect = this.itemRect(this.index());
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
    */
};

Skills_Window.prototype.cursorDown = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    var index0 = this.index() % maxCols;
    var skills = this._tree.skills;

    while (index < maxItems) {
        index = index + maxCols;

        if (index >= maxItems && index0 < maxCols)
            index = ++index0;

        if (index < maxItems && skills[index] instanceof Skill)
            break;
    }

    if (skills[index])
        this.select(index);
};

Skills_Window.prototype.cursorUp = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    var index0bound = Math.floor(maxItems / maxCols) * maxCols;
    var index0 = this.index() % maxCols + index0bound;
    var skills = this._tree.skills;

    while (index >= 0) {
        index = index - maxCols;

        if (index < 0 && index0 - 1 > index0bound)
            index = --index0;

        if (index >= 0 && skills[index] instanceof Skill)
            break;
    }

    if (skills[index])
        this.select(index);
};

Skills_Window.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    var skills = this._tree.skills;

    if (maxCols >= 2 && (index < maxItems - 1 || (wrap && this.isHorizontal()))) {
        while (++index < maxItems && !(skills[index] instanceof Skill));

        if (skills[index])
            this.select((index) % maxItems);
    }
};

Skills_Window.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var maxItems = this.maxItems();
    var maxCols = this.maxCols();
    var skills = this._tree.skills;

    if (maxCols >= 2 && (index > 0 || (wrap && this.isHorizontal()))) {
        while (--index > 0 && !(skills[index] instanceof Skill));

        if (skills[index])
            this.select((index + maxItems) % maxItems);
    }
};

/**
 * @method _refreshCursor
 * @private
 */
Skills_Window.prototype._refreshCursor = function() {
    this._padding -= this.spacing();
    Window.prototype._refreshCursor.call(this);
    this._padding += this.spacing();
};

Skills_Window.prototype.isCursorVisible = function() {
    var row = this.row();

    return row >= this.topRow() && row <= this.bottomRow();
};

Skills_Window.prototype.ensureCursorVisible = function() {
    // TODO for long skill trees
    /*
    var row = this.row();
    if (row < this.topRow()) {
        this.setTopRow(row);
    } else if (row > this.bottomRow()) {
        this.setBottomRow(row);
    }
     */
};

//-----------------------------------------------------------------------------
// Description Window
//
// The window showing a skill description on the abilities screen.

function Description_Window() {
    this.initialize.apply(this, arguments);
}

Description_Window.prototype = Object.create(Window_Base.prototype);
Description_Window.prototype.constructor = Description_Window;

Description_Window.prototype.initialize = function(x, y) {
    Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
    this._actor = null;
    this._tree = null;
    this._skill = null;
};

Description_Window.prototype.windowWidth = function() {
    return Graphics.boxWidth - (Window_Base._iconWidth * SkillTreesSystem.skillWindowMaxCols + this.standardPadding() * 2 - 8);
};

Description_Window.prototype.windowHeight = function() {
    return Graphics.boxHeight - this.fittingHeight(1);
};

Description_Window.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Description_Window.prototype.showDescripion = function (tree, skill) {
    this._tree = tree;
    this._skill = skill;
    this.refresh();
};

Description_Window.prototype.refresh = function() {
    if (this.contents) {
        this.contents.clear();

        var fullW = this.windowWidth() - this.padding * 2;
        var w = (fullW - Window_Base._faceWidth) / 2;

        if (this._actor) {

            this.drawActorFace(this._actor, 0, 0, Window_Base._faceWidth, Window_Base._faceHeight);

            this.drawActorName(this._actor, Window_Base._faceWidth, 0, w);
            this.drawActorLevel(this._actor, Window_Base._faceWidth + w, 0);

            this.drawActorClass(this._actor, Window_Base._faceWidth, this.lineHeight(), w);
            this.drawActorFreePoints(this._actor, Window_Base._faceWidth + w, this.lineHeight(), w);

            if (this._tree)
                this.drawActorTreePoints(this._actor, this._tree, Window_Base._faceWidth, this.lineHeight() * 2, w * 2);

            // Line 3 is empty.
            this.drawLine(this.lineHeight() * 4);
        }

        if (this._skill) {
            var skill = this._skill.nextLevel();

            this.drawIcon(this._skill.iconId(), 0, this.lineHeight() * 5);
            this.drawText(skill.name, Window_Base._iconWidth + this.spacing(), this.lineHeight() * 5, this.windowWidth() - w - Window_Base._iconWidth - this.spacing());
            this.drawCastCost(skill, this.windowWidth() - w, this.lineHeight() * 5, w);

            var desc = skill.description.split("\n");

            this.drawText(desc[0], 0, this.lineHeight() * 6, fullW);
            this.drawText(desc[1], 0, this.lineHeight() * 7, fullW);

            var reqs = this._skill.requirements();

            if (reqs) {
                this.drawLine(this.lineHeight() * 8);
                this.drawText(SkillTreesSystem.requirementsText(), 0, this.lineHeight() * 9);
                this.drawRequirements(reqs, this.lineHeight() * 10);
            }
        }
    }
};

Description_Window.prototype.drawActorFreePoints = function(actor, x, y, width) {
    if (!actor.skillTrees)
        return;

    var text = SkillTreesSystem.freePointsText();
    var textWidth = this.textWidth(text);
    textWidth = (textWidth < width - 50) ? textWidth : width - 50;
    var valWidth = width - textWidth;

    this.changeTextColor(this.systemColor());
    this.drawText(text, x, y, textWidth);
    this.changeTextColor(this.normalColor());
    this.drawText(actor.skillTrees.points, x + this.textWidth(text), y, valWidth);
};

Description_Window.prototype.drawActorTreePoints = function(actor, tree, x, y, width) {
    var text = SkillTreesSystem.treePointsText(tree);
    var textWidth = this.textWidth(text);
    textWidth = (textWidth < width - 50) ? textWidth : width - 50;
    var valWidth = width - textWidth;

    this.changeTextColor(this.systemColor());
    this.drawText(text, x, y, textWidth);
    this.changeTextColor(this.normalColor());
    this.drawText(this._tree.points, x + textWidth, y, valWidth);
};

/**
 * I don't know why this method
 *
 * @param y Text line where horizontal line should be drawn.
 */
Description_Window.prototype.drawLine = function(y) {
    var lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    this.contents.fillRect(0, lineY, this.windowWidth() - this.padding * 2, 2, this.normalColor());
    this.contents.paintOpacity = 255;
};

Description_Window.prototype.drawCastCost = function(skill, x, y, w) {
    // TODO
};

Description_Window.prototype.drawRequirements = function(reqs, y) {
    var color = this.textColor();

    for (var i = 0; i < reqs.length; i++) {
        var req = reqs[i];

        if (req.meets(this._actor, this._tree))
            this.changeTextColor(this.powerUpColor())
        else
            this.changeTextColor(this.powerDownColor())

        this.drawText(req.text(), 0, y);

        y += this.lineHeight();
    }

    this.changeTextColor(color);
};

Description_Window.prototype.spacing = function() {
    return 12;
};

//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

SkillTreesSystem.gameActorLevelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
    SkillTreesSystem.gameActorLevelUp.call(this);

    if (this.skillTrees)
        this.skillTrees.points += SkillTreesSystem.pointsPerLevel;
};

SkillTreesSystem.gameActorDisplayLevelUp = Game_Actor.prototype.displayLevelUp;
Game_Actor.prototype.displayLevelUp = function(newSkills) {
    SkillTreesSystem.gameActorDisplayLevelUp.call(this, newSkills);

    if (SkillTreesSystem.pointsPerLevel > 0)
        $gameMessage.add(SkillTreesSystem.pointsPerLevel + " " + SkillTreesSystem._earnPointsText);
}
