//=============================================================================
// SkillTreesSystem.js
//=============================================================================

/*:
 * @plugindesc v1.9. Basic skill trees in a separate scene.
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
 * Set 0 if you want to give skill points manually.
 * @default 3
 *
 * @param Single Points Pool
 * @parent ---General---
 * @type boolean
 * @on Single Pool
 * @off Separate Pools
 * @desc Use one points pool for every actor's skill trees or separate pools for every class.
 * @default true
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
 * @desc Amount of skills will be contained in a single row of the skill tree window.
 * @default 7
 *
 * @param Draw skills in a row
 * @parent ---General---
 * @type number
 * @min 1
 * @desc Amount of skills that will be shown in a single row of the skill tree window.
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
 * @param Skill icon scale factor
 * @parent ---General---
 * @type float
 * @min 1
 * @desc Drawing size for skills. Separate arrows from icons with opaque background to remove glitches.
 * @default 1
 *
 * @param Learn by double click
 * @parent ---General---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Learn skill by double click or by separate button.
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
 * @default SP earned.
 *
 * @param No trees text
 * @parent ---Text---
 * @desc Text to describe absence of any skill tree.
 * @default No skill trees available.
 *
 * @param Free points text
 * @parent ---Text---
 * @desc Text for free skill points to show in the skill description window.
 * @default SP
 *
 * @param Tree points text
 * @parent ---Text---
 * @desc Text for skill points used in the tree to show in the skill description window.
 * @default SP in %1
 *
 * @param Requirements text
 * @parent ---Text---
 * @desc Text for skill requirements to show in the skill description window.
 * @default Requirements:
 *
 * @param Maxed skill text
 * @parent ---Text---
 * @desc Text for maxed skill level.
 * @default MAX
 *
 * @param Maxed skill text Y position
 * @parent ---Text---
 * @type number
 * @desc Y position for skill level text in Skills Window.
 * @default 0
 *
 * @param Confirmation button text
 * @parent ---Text---
 * @desc Text for confirmation button to learn skill.
 * @default Learn
 *
 * @param ---Yanfly---
 * @default
 *
 * @param Use Job Points only
 * @parent ---Yanfly---
 * @type boolean
 * @on Yes
 * @off No
 * @desc Use JP for skill trees instead of skill tree points? Disables Single Points Pool.
 * NO - false     YES - true
 * @default false
 *
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 *
 * To use this plugin you need to create your own skill trees in the
 * SkillTreesConfig.js file and add trees to the SkillTreesSystem.actor2trees
 * or SkillTreesSystem.class2trees.
 *
 * These trees will be added to the actors automatically.
 *
 * To add tree or skill points manually use next code:
 *
 *     actor.addTree(skillTree);
 *     actor.addTreesPoints(points, classId);
 *
 *     You need to create skillTree in the end of `SkillTreesConfig.js` file
 *     and add to `SkillTreesSystem.otherTrees` array.
 *     Or use `SkillTreesSystem.actor2trees` and `SkillTreesSystem.class2trees`:
 *     trees described here are added automatically on the game start
 *     to the actors and actors with specified class respectively.
 *
 * To get free points for specific tree:
 *
 *     actor.getTreesPoints(skillTree);
 *
 * To hide specific tree for the actor:
 *
 *     actor.hideTree(treeSymbol);
 *
 * To learn skills by script call:
 *
 *     SkillTreesSystem.forceLearn(actor, treeSymbol, skillId);
 *     SkillTreesSystem.forceLearnAll(actor, treeSymbol);
 *     SkillTreesSystem.forceLearnAll(actor);
 *     SkillTreesSystem.tryLearn(actor, treeSymbol, skillId);
 *     SkillTreesSystem.tryLearnAll(actor, treeSymbol);
 *     SkillTreesSystem.tryLearnAll(actor);
 *
 * See SkillTreesConfig.js for details.
 *
 * To show scene with skill trees:
 *     SceneManager.push(Scene_SkillTrees)
 *
 * To show unspent skill points in game messages:
 *     \SP[actorId] (single points pool only)
 *     \SP[actorId, treeId]
 *
 *     Will be replaced with unspent skill points for actor with given ID
 *     and for tree with given treeId.
 *
 * To reset skills by script call:
 *     SkillTreesSystem.resetSkillTrees(actor, treeId)
 *     SkillTreesSystem.resetSkillTrees(actor, classId)
 *     SkillTreesSystem.resetSkillTrees(actor, 'actor')
 *     SkillTreesSystem.resetSkillTrees(actor, 'all')
 *
 *     You need to replace treeId and classId only.
 *     'actor' and 'all' are keywords already. Do not replace them.
 *
 * To reset skills by item use next notes:
 *     <resetSkillTrees:treeId>
 *     <resetSkillTrees:classId>
 *     <resetSkillTrees:actor>
 *     <resetSkillTrees:all>
 *
 *     You need to replace treeId and classId only.
 *     "actor" and "all" (without quotes) are keywords already.
 *     Do not replace them.
 *
 * ----------------------------------------------------------------------------
 *
 * If something works not as expected - check console log (F8 should open it).
 *
 * ============================================================================
 * Terms of use
 * ============================================================================
 *
 * Free to use in any RPG Maker MV project including commercial.
 * Credit "SomeFire" and, please, let me know about your game.
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
 * Version 1.3:
 * - Loading bug fixed.
 *
 * Version 1.4:
 * - Separate Points Pools for class trees.
 * - YEP Job Points and class plugins integration.
 *
 * Version 1.5:
 * - Ability to reset skill trees during the game.
 * - Working message box commands for skill descriptions.
 * - Draw skill cost in MP and TP.
 * - bugfixes.
 *
 * Version 1.6:
 * - Ensure cursor visibility for long trees.
 * - Fixed bug with on learn actions.
 *
 * Version 1.7:
 * - Changed sound for skills unable to learn.
 * - Added script calls to learn skills in skill trees.
 * - Added scale factor for skill icons.
 * - Added stats requirement.
 *
 * Version 1.8:
 * - Fixed bug which gives skill point on resetting empty tree.
 * - Fixed MP and TP naming in skill description window.
 * - Trees are updatable now.
 * - Reworked separate points pool.
 * - Added script call to hide tree.
 *
 * Version 1.9:
 * - Show YEP skill cooldown and warmup.
 * - Add possibility to use SP and JP simultaneously.
 * - Add confirmation button to learn skills.
 *
 * Version 1.10:
 * - Added actor and tree to OnLearnAction.act() method.
 * - Added text command to show unspent skills.
 * - Added script calls to reset skills.
 * - Fixed possible bug with big skill cursor when Window_Selectable spacing was overwritten.
 * - Fixed bug when skill cooldown wasn't shown without MP/TP.
 * - Fixed game crashes when actor have no trees.
 * - Improved font size for long skill descriptions.
 * - Text for maxed skill level can be changed as plugin parameter.
 * - Reworked example skills.
 *
 */

//=============================================================================
// System Variables
//=============================================================================

var SkillTreesSystem = SkillTreesSystem || {};
SkillTreesSystem.Parameters = PluginManager.parameters('SkillTreesSystem');

// ---General---

/** Amount of skill points given per level. */
SkillTreesSystem.pointsPerLevel = Number(SkillTreesSystem.Parameters['Skill points per level']);

/**
 * Use one points pool for every actor's skill trees or separate pools for every class.
 * You can specify class trees in the SkillTreesSystem.class2trees in SkillTreesConfig.js file.
 * Nonclass trees will use points of current active class.
 */
SkillTreesSystem.singlePointsPool = eval(SkillTreesSystem.Parameters['Single Points Pool']);

/** Amount of trees shown on the window at a time. */
SkillTreesSystem.treeWindowMaxCols = Number(SkillTreesSystem.Parameters['Trees in a row']);

/** Amount of skill slots in a single row. */
SkillTreesSystem.skillWindowMaxCols = Number(SkillTreesSystem.Parameters['Skills in a row']);

/** How many skill slots will be drawn in a single row. */
SkillTreesSystem.skillWindowDrawCols = Number(SkillTreesSystem.Parameters['Draw skills in a row']);

/** Use big cursor for skill icons with opaque background. Use small cursor for icons with transparent background. */
SkillTreesSystem.skillCursorMargin = eval(SkillTreesSystem.Parameters['Margin for skill cursor']);

/** Drawing size for skills. */
SkillTreesSystem.skillScale = Number(SkillTreesSystem.Parameters['Skill icon scale factor']);

/** Learn skill by double click or by separate button. */
SkillTreesSystem.learnByDoubleClick = eval(SkillTreesSystem.Parameters['Learn by double click']);

// ---Text---

/** Text for the menu button. */
SkillTreesSystem.buttonValue = String(SkillTreesSystem.Parameters['Button value']);

/** Text to describe how much skill points is earned. */
SkillTreesSystem._earnPointsText = String(SkillTreesSystem.Parameters['Earning points text']);

/** Text used to describe absence of any skill tree. */
SkillTreesSystem._noTreesText = String(SkillTreesSystem.Parameters['No trees text']);

/** Text for free skill points to show in the skill description window. */
SkillTreesSystem._freePointsText = String(SkillTreesSystem.Parameters['Free points text']);

/** Text for skill points used in the tree to show in the skill description window. */
SkillTreesSystem._treePointsText = String(SkillTreesSystem.Parameters['Tree points text']);

/** Text for skill requirements to show in the skill description window. */
SkillTreesSystem._requirementsText = String(SkillTreesSystem.Parameters['Requirements text']);

/** Text for maxed skill level. */
SkillTreesSystem._maxedSkillText = String(SkillTreesSystem.Parameters['Maxed skill text']);

/** Y position for skill level text in Skills Window. */
SkillTreesSystem._maxedSkillTextYPosition = Number(SkillTreesSystem.Parameters['Maxed skill text Y position']);

/** Text for skill cooldown shown in the skill description. */
SkillTreesSystem.skillCooldownText = Yanfly && Yanfly.SCD ? Yanfly.Param.CDFmt.replace("%1", "") : null;

/** Text for skill cooldown shown in the skill description. */
SkillTreesSystem.skillWarmupText = Yanfly && Yanfly.SCD ? Yanfly.Param.WUFmt.replace("%1", "") : null;

/** Text for confirmation button to learn skill. */
SkillTreesSystem.confirmationButtonText = String(SkillTreesSystem.Parameters['Confirmation button text']);

/**
 * Text for free skill points to show in the skill description window.
 */
SkillTreesSystem.freePointsText = function() {
    return (SkillTreesSystem.useJP() ? Yanfly.Param.Jp : SkillTreesSystem._freePointsText) + ": ";
};

/**
 * Text for skill points used in the tree to show in the skill description window.
 */
SkillTreesSystem.treePointsText = function(tree) {
    return SkillTreesSystem._treePointsText.format(tree.name) + ": ";
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

// ---Yanfly---

var Yanfly = Yanfly || {};

/**
 * Use JP for skill trees instead of skill tree points?
 *
 * You can specify class trees in the SkillTreesSystem.class2trees in SkillTreesConfig.js file.
 * Nonclass trees will use points of current active class.
 *
 * Single points pool doesn't work with Job Points.
 */
SkillTreesSystem._useJP = eval(SkillTreesSystem.Parameters['Use Job Points only']);

if (SkillTreesSystem.singlePointsPool && SkillTreesSystem._useJP) {
    SkillTreesSystem.singlePointsPool = false;

    console.log("Single Points Pool isn't available for Job Points." +
        " Single Pool was disabled.");
}

SkillTreesSystem.useJP = function() {
    return Yanfly.JP && Yanfly.JP.version && SkillTreesSystem._useJP;
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

    if (!SkillTreesSystem.learnByDoubleClick) {
        this._confirmationButton = new Learn_Button_Window(0, 0, this);
        this._confirmationButton.move(
            this._skillsWindow.windowWidth() + this._descriptionWindow.windowWidth()/2 - this._confirmationButton.windowWidth()/2,
            this._treesWindow.windowHeight() + this._descriptionWindow.textPadding() * 2 + this._treesWindow.lineHeight() * 8,
            this._confirmationButton.windowWidth(),
            this._confirmationButton.windowHeight());
        this.addWindow(this._confirmationButton);
        this._skillsWindow._confirmationButton = this._confirmationButton;
        this._confirmationButton.hide();
    }

    this.refreshActor();
};

Scene_SkillTrees.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this.refreshActor();
    this.refresh();

    if (this._isSingleTreeActor())
        this._treesWindow.processOk();
};

Scene_SkillTrees.prototype.refresh = function() {
    this._treesWindow.refresh();
    this._skillsWindow.refresh();
    this._descriptionWindow.refresh();
};

Scene_SkillTrees.prototype.refreshActor = function() {
    let actor = this.actor();
    this._treesWindow.setActor(actor);
    this._skillsWindow.setActor(actor);
    this._descriptionWindow.setActor(actor);
};

Scene_SkillTrees.prototype.onActorChange = function() {
    this.refreshActor();
    this._treesWindow.activate();
    this._treesWindow.selectLast();

    if (!SkillTreesSystem.learnByDoubleClick)
        this._confirmationButton.hide();

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
    let actor = this._descriptionWindow._actor;
    let tree = this._descriptionWindow._tree;
    let skill = this._descriptionWindow._skill;

    if (skill.isAvailableToLearn(actor, tree)) {
        if (SkillTreesSystem.learnByDoubleClick) {
            skill.learn(actor, tree);

            this.refresh();
        } else
            this._confirmationButton._hook = true;
    }

    this._skillsWindow.activate();
};

Scene_SkillTrees.prototype.onItemCancel = function() {
    Skills_Window._lastSelectedIndex[this._actor.actorId()][this._skillsWindow._tree.symbol] = this._skillsWindow.index();

    if (!SkillTreesSystem.learnByDoubleClick)
        this._confirmationButton.hide();

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
            for (let tree of this._actor.skillTrees.trees) {
                if (tree.isVisible())
                    this.addCommand(tree.name, tree.symbol, true);
            }
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

    if (this._actor && this._descriptionWindow) {
        this._descriptionWindow.showDescription(this._actor.skillTrees ?
            this._actor.skillTrees.getTree(this.currentSymbol()) :
            null);
    }
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
    let w = this._width;
    let h = this._height;
    let p = 24; // arrow width
    let q = p/2; // arrow height
    let sx = 96+p;
    let sy = 0+p;
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
    let tooManyItems = this.maxItems() > SkillTreesSystem.treeWindowMaxCols;

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

Skills_Window.prototype.spacing = function() {
    return 12;
};

Skills_Window.prototype.windowWidth = function() {
    return this.itemWidth() * SkillTreesSystem.skillWindowDrawCols + this.standardPadding() * 2;
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
        let trees = this._actor.skillTrees.trees;

        for (let i = 0; i < trees.length; i++) {
            if (trees[i].symbol === symbol)
                return trees[i];
        }
    }

    return null;
};

Skills_Window.prototype.itemWidth = function() {
    return Window_Base._iconWidth * SkillTreesSystem.skillScale;
};

Skills_Window.prototype.itemHeight = function() {
    return Window_Base._iconHeight * SkillTreesSystem.skillScale;
};

Skills_Window.prototype.drawItem = function(treeObj, index) {
    let x = this.itemWidth() * (index % SkillTreesSystem.skillWindowMaxCols) - this._scrollX;
    let y = this.itemHeight() * Math.floor(index / SkillTreesSystem.skillWindowMaxCols) - this._scrollY;

    this.changePaintOpacity(treeObj.isEnabled(this._actor, this._tree));
    this.drawIcon(treeObj.iconId(), x, y);
    this.changePaintOpacity(1);

    if (treeObj instanceof Skill) {
        let size = this.contents.fontSize;
        this.contents.fontSize = this.itemHeight() / 3;

        if (treeObj.currentLevel() === treeObj.maxLevel())
            var text = SkillTreesSystem._maxedSkillText;
        else
            text = treeObj.currentLevel() + "/" + treeObj.maxLevel();

        this.drawText(
            text,
            x + 2,
            y + this.itemHeight() / 4 + SkillTreesSystem._maxedSkillTextYPosition,
            this.itemWidth() - 4,
            'center'
        );

        this.contents.fontSize = size;
    }
};

Skills_Window.prototype.drawText = function(text, x, y, maxWidth, align) {
    this.contents.drawText(text, x, y, maxWidth, this.lineHeight() * SkillTreesSystem.skillScale, align);
};

Skills_Window.prototype.drawIcon = function(iconIndex, x, y) {
    let bitmap = ImageManager.loadSystem('IconSet');
    let pw = Window_Base._iconWidth;
    let ph = Window_Base._iconHeight;
    let sx = iconIndex % 16 * pw;
    let sy = Math.floor(iconIndex / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, pw * SkillTreesSystem.skillScale, ph * SkillTreesSystem.skillScale);
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

    if (index === -1)
        return;

    if (this._descriptionWindow) {
        let skill = this._tree ? this._tree.skills[index] : null;

        this._descriptionWindow.showDescription(this._tree, skill);

        if (!SkillTreesSystem.learnByDoubleClick && skill instanceof Skill) {
            this._confirmationButton.skill = skill;
            this._confirmationButton.actor = this._actor;
            this._confirmationButton.tree = this._tree;

            if (skill.isAvailableToLearn(this._actor, this._tree))
                this._confirmationButton.show();
            else
                this._confirmationButton.hide();
        }
    }
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
    let rect = new Rectangle();
    let maxCols = this.maxCols();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    rect.x = this.itemWidth() * (index % maxCols) - this._scrollX;
    rect.y = this.itemHeight() * Math.floor(index / maxCols) - this._scrollY;
    return rect;
};

Skills_Window.prototype.updateCursor = function() {
    if (this.isCursorVisible()) {
        let rect = this.itemRect(this.index());

        if (SkillTreesSystem.skillCursorMargin) {
            this.setCursorRect(rect.x + this.spacing() / 2, rect.y + this.spacing() / 2,
                rect.width + this.spacing(), rect.height + this.spacing());
        } else
            this.setCursorRect(rect.x + this.spacing(), rect.y + this.spacing(), rect.width, rect.height);
    } else
        this.setCursorRect(0, 0, 0, 0);

    /*
    if (this._cursorAll) {
        let allRowsHeight = this.maxRows() * this.itemHeight();
        this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
        this.setTopRow(0);
    } else if (this.isCursorVisible()) {
        let rect = this.itemRect(this.index());
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    } else {
        this.setCursorRect(0, 0, 0, 0);
    }
    */
};

Skills_Window.prototype.cursorDown = function(wrap) {
    let index = this.index();
    let maxItems = this.maxItems();
    let maxCols = SkillTreesSystem.skillWindowMaxCols;
    let index0 = this.index() % maxCols;
    let skills = this._tree.skills;

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
    let index = this.index();
    let maxItems = this.maxItems();
    let maxCols = SkillTreesSystem.skillWindowMaxCols;
    let index0bound = Math.floor(maxItems / maxCols) * maxCols;
    let index0 = this.index() % maxCols + index0bound;
    let skills = this._tree.skills;

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
    let index = this.index();
    let maxItems = this.maxItems();
    let maxCols = SkillTreesSystem.skillWindowDrawCols;
    let skills = this._tree.skills;

    if (maxCols >= 2 && (index < maxItems - 1 || (wrap && this.isHorizontal()))) {
        while (++index < maxItems && !(skills[index] instanceof Skill));

        if (skills[index])
            this.select((index) % maxItems);
    }
};

Skills_Window.prototype.cursorLeft = function(wrap) {
    let index = this.index();
    let maxItems = this.maxItems();
    let maxCols = SkillTreesSystem.skillWindowDrawCols;
    let skills = this._tree.skills;

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
    let row = this.row();

    return row >= this.topRow() && row <= this.bottomRow();
};

SkillTreesSystem.ensureCursorVisible = Window_Selectable.prototype.ensureCursorVisible;
Skills_Window.prototype.ensureCursorVisible = function() {
    SkillTreesSystem.ensureCursorVisible.call(this);

    let col = this.column();
    if (col < this.rightColumn()) {
        this.setRightColumn(col);
    } else if (col > this.leftColumn()) {
        this.setLeftColumn(col);
    }

    /*
    let row = this.row();
    if (row < this.topRow()) {
        this.setTopRow(row);
    } else if (row > this.bottomRow()) {
        this.setBottomRow(row);
    }
     */
};

Skills_Window.prototype.column = function() {
    return this.index() % SkillTreesSystem.skillWindowMaxCols;
};

Skills_Window.prototype.rightColumn = function() {
    return Math.floor(this._scrollX / this.itemWidth());
};

Skills_Window.prototype.maxRightColumn = function() {
    return Math.max(0, this.maxCols() - SkillTreesSystem.skillWindowDrawCols);
};

Skills_Window.prototype.setRightColumn = function(col) {
    let scrollX = col.clamp(0, this.maxRightColumn()) * this.itemWidth();
    if (this._scrollX !== scrollX) {
        this._scrollX = scrollX;
        this.refresh();
        this.updateCursor();
    }
};

Skills_Window.prototype.leftColumn = function() {
    return Math.max(0, this.rightColumn() + SkillTreesSystem.skillWindowDrawCols - 1);
};

Skills_Window.prototype.setLeftColumn = function(row) {
    this.setRightColumn(row - (SkillTreesSystem.skillWindowDrawCols - 1));
};

Skills_Window.prototype.isCurrentItemEnabled = function() {
    let actor = this._descriptionWindow._actor;
    let tree = this._descriptionWindow._tree;
    let skill = this._descriptionWindow._skill;

    return skill.isAvailableToLearn(actor, tree);
};

SkillTreesSystem.skillsWindow_processOk = Skills_Window.prototype.processOk;
Skills_Window.prototype.processOk = function() {
    if (SkillTreesSystem.learnByDoubleClick)
        SkillTreesSystem.skillsWindow_processOk.call(this);
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
    return Graphics.boxWidth - (Window_Base._iconWidth * SkillTreesSystem.skillScale * SkillTreesSystem.skillWindowDrawCols + this.standardPadding() * 2);
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

Description_Window.prototype.showDescription = function(tree, skill) {
    this._tree = tree;
    this._skill = skill;
    this.refresh();
};

Description_Window.prototype.refresh = function() {
    if (this.contents) {
        this.contents.clear();

        let fullW = this.windowWidth() - this.padding * 2;
        let w = (fullW - Window_Base._faceWidth) / 2;
        let line = 0;

        if (this._actor) {
            // Line 0.
            this.drawActorFace(this._actor, 0, this.lineHeight() * line, Window_Base._faceWidth, Window_Base._faceHeight);

            this.drawActorName(this._actor, Window_Base._faceWidth + this.spacing(), this.lineHeight() * line, w);
            this.drawActorLevel(this._actor, Window_Base._faceWidth + this.spacing() + w, this.lineHeight() * line++);

            // Line 1.
            this.drawActorClass(this._actor, Window_Base._faceWidth + this.spacing(), this.lineHeight() * line, w);
            this.drawActorFreePoints(this._actor, this._tree, Window_Base._faceWidth + this.spacing() + w, this.lineHeight() * line++, w);

            // Line 2.
            if (Yanfly.JP && !SkillTreesSystem.useJP())
                this.drawJP(this._actor, this._tree, Window_Base._faceWidth + this.spacing() + w, this.lineHeight() * line, w);

            line++;

            // Line 3.
            if (this._tree)
                this.drawActorTreePoints(this._actor, this._tree, Window_Base._faceWidth + this.spacing(), this.lineHeight() * line, w * 2);

            line++;

            // Line 4 is empty.
            this.drawLine(this.lineHeight() * line++);
        }

        if (this._skill) {
            // Line 5.
            let skill = this._skill.nextLevel();

            this.drawIcon(this._skill.iconId(), 0, this.lineHeight() * line);
            this.drawText(skill.name, Window_Base._iconWidth + this.spacing(), this.lineHeight() * line, this.windowWidth() - w - Window_Base._iconWidth - this.spacing());
            this.drawCastCost(skill, fullW - w, this.lineHeight() * line++, w);

            // Lines 6 and 7.
            this.drawSkillDescription(skill.description, 0, this.lineHeight() * line++, fullW);
            this.resetFontSettings();
            this.resetTextColor();

            line++;

            // Lines 8, 9, 10.
            let reqs = this._skill.requirements();

            if (reqs) {
                this.drawLine(this.lineHeight() * line++);
                this.drawText(SkillTreesSystem.requirementsText(), 0, this.lineHeight() * line++);
                this.drawRequirements(reqs, this.lineHeight() * line++);
            }
        }
    }
};

Description_Window.prototype.drawActorFreePoints = function(actor, tree, x, y, width) {
    if (!actor.skillTrees)
        return;

    let text = SkillTreesSystem.freePointsText();
    let textWidth = this.textWidth(text);
    textWidth = (textWidth < width - 50) ? textWidth : width - 50;
    let valWidth = width - textWidth;

    this.changeTextColor(this.systemColor());
    this.drawText(text, x, y, textWidth);
    this.changeTextColor(this.normalColor());
    this.drawText(actor.getTreesPoints(tree), x + this.textWidth(text), y, valWidth);
};

Description_Window.prototype.drawJP = function(actor, tree, x, y, width) {
    if (!actor.skillTrees)
        return;

    let text = Yanfly.Param.Jp + ": ";
    let textWidth = this.textWidth(text);
    textWidth = (textWidth < width - 50) ? textWidth : width - 50;
    let valWidth = width - textWidth;

    this.changeTextColor(this.systemColor());
    this.drawText(text, x, y, textWidth);
    this.changeTextColor(this.normalColor());
    this.drawText(tree ? actor.jp(tree._classId) : "0", x + this.textWidth(text), y, valWidth);
};

Description_Window.prototype.drawActorTreePoints = function(actor, tree, x, y, width) {
    let text = SkillTreesSystem.treePointsText(tree);
    let textWidth = this.textWidth(text);
    textWidth = (textWidth < width - 50) ? textWidth : width - 50;
    let valWidth = width - textWidth;

    this.changeTextColor(this.systemColor());
    this.drawText(text, x, y, textWidth);
    this.changeTextColor(this.normalColor());
    this.drawText(this._tree.points, x + textWidth, y, valWidth);
};

/**
 * @param y Text line where horizontal line should be drawn.
 */
Description_Window.prototype.drawLine = function(y) {
    let lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    this.contents.fillRect(0, lineY, this.windowWidth() - this.padding * 2, 2, this.normalColor());
    this.contents.paintOpacity = 255;
};

Description_Window.prototype.drawCastCost = function(skill, x, y, widthLimit) {
    let cdText = this.getSkillCooldownText(skill);

    if (!skill.mpCost && !skill.tpCost && cdText.length === 0)
        return;

    let text = "";

    if (skill.mpCost) {
        text += skill.mpCost + " \\C[" + (Yanfly.Param && Yanfly.Param.ColorMpCost || 23) + "]" +
            TextManager.mpA + "\\C";
    }

    if (skill.mpCost && skill.tpCost)
        text += ", ";

    if (skill.tpCost) {
        text += skill.tpCost + " \\C[" + (Yanfly.Param && Yanfly.Param.ColorTpCost || 29) + "]" +
            TextManager.tpA + "\\C";
    }

    if (cdText.length > 0) {
        if (text.length > 0)
            text += ", ";

        text += cdText;
    }

    this.drawTextDecreased(text, x, y, widthLimit);
};

Description_Window.prototype.drawSkillDescription = function (text, x, y, widthLimit) {
    this.drawTextDecreased(text, x, y, widthLimit);
};

Description_Window.prototype.getSkillCooldownText = function(skill) {
    if (!Yanfly.SCD)
        return "";

    if (!SkillTreesSystem.skillCooldownText || !SkillTreesSystem.skillWarmupText) {
        console.warn("Skill Trees System plugin must be placed under YEP Skill Cooldowns plugin.");

        return "";
    }

    let text = "";

    if (skill.cooldown && skill.cooldown[skill.id] > 0) {
        text += Yanfly.Util.toGroup(skill.cooldown[skill.id]) + "\\C[" + Yanfly.Param.CDTextColor + "] " +
            SkillTreesSystem.skillCooldownText + "\\C";
    }

    if (skill.warmup > 0) {
        if (text.length > 0)
            text += ", ";

        text += Yanfly.Util.toGroup(skill.warmup) + "\\C[" + Yanfly.Param.WUTextColor + "] " +
            SkillTreesSystem.skillWarmupText + "\\C";
    }

    return text;
};

Description_Window.prototype.drawTextDecreased = function(text, x, y, widthLimit) {
    let w = this.textWidthEx(text);

    if (w <= widthLimit)
        this.drawTextEx(text, x, y);
    else {
        let delta = 2;
        let dfltFontSize = this.contents.fontSize;
        let fontSize = dfltFontSize - delta;

        while (this.textWidthWithFontSize(text, fontSize) > widthLimit)
            fontSize -= delta;

        this.drawTextWithFontSize(text, x, y + (dfltFontSize - fontSize) / 2, fontSize);
    }
};

Description_Window.prototype.drawRequirements = function(reqs, y) {
    for (let i = 0; i < reqs.length; i++) {
        let req = reqs[i];

        if (req.meets(this._actor, this._tree))
            this.changeTextColor(this.powerUpColor());
        else
            this.changeTextColor(this.powerDownColor());

        this.drawText(req.text(), 0, y);

        y += this.lineHeight();
    }

    this.changeTextColor(this.normalColor());
};

Description_Window.prototype.textWidthWithFontSize = function(text, fontSize) {
    return this.drawTextWithFontSize(text, 0, this.contents.height + this.lineHeight(), fontSize);
};

Description_Window.prototype.drawTextWithFontSize = function(text, x, y, fontSize) {
    if (text) {
        this.resetFontSettings();
        this.contents.fontSize = fontSize;
        let textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(text);
        textState.height = this.calcTextHeight(textState, false);
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        return textState.x - x;
    } else {
        return 0;
    }
};

Description_Window.prototype.spacing = function() {
    return 12;
};

//-----------------------------------------------------------------------------
// Learn Button Window
//
// The window for selecting a skill tree on the abilities screen.

function Learn_Button_Window() {
    this.initialize.apply(this, arguments);
}

Learn_Button_Window.prototype = Object.create(Window_Command.prototype);
Learn_Button_Window.prototype.constructor = Learn_Button_Window;

Learn_Button_Window.prototype.initialize = function(x, y, scene) {
    Window_Command.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());

    this.scene = scene;
    this.actor = null;
    this.tree = null;
    this.skill = null;
};

Learn_Button_Window.prototype.windowWidth = function() {
    return Graphics.boxWidth / 8;
};

Learn_Button_Window.prototype.standardFontSize = function() {
    return Window_Command.prototype.standardPadding.call(this) * 0.9;
};

Learn_Button_Window.prototype.standardPadding = function() {
    return Window_Command.prototype.standardPadding.call(this) / 2;
};

Learn_Button_Window.prototype.lineHeight = function() {
    return Window_Command.prototype.lineHeight.call(this) * 0.8;
};

Learn_Button_Window.prototype.numVisibleRows = function() {
    return 1;
};

Learn_Button_Window.prototype.maxCols = function() {
    return 1;
};

Learn_Button_Window.prototype.makeCommandList = function() {
    this.addCommand(SkillTreesSystem.confirmationButtonText, "learn_skill", true);
};

Learn_Button_Window.prototype.processOk = function() {
    if (this._hook || !this.visible) {
        this._hook = false;

        return;
    }

    if (SkillTreesSystem.learnByDoubleClick)
        return;

    this.skill.learn(this.actor, this.tree);

    if (!this.skill.isAvailableToLearn(this.actor, this.tree))
        this.hide();

    this.scene.refresh();

    this.playOkSound();
};

Learn_Button_Window.prototype.isCurrentItemEnabled = function() {
    return this.skill.isAvailableToLearn(this.actor, this.tree);
};

Learn_Button_Window.prototype.itemTextAlign = function() {
    return 'center';
};

//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

SkillTreesSystem.gameActorLevelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
    SkillTreesSystem.gameActorLevelUp.call(this);

    if (!this.skillTrees)
        return;

    if (SkillTreesSystem.useJP())
        return;

    if (this._classChangeInProgress)
        return;

    this.addTreesPoints(SkillTreesSystem.pointsPerLevel);
};

SkillTreesSystem.gameActorDisplayLevelUp = Game_Actor.prototype.displayLevelUp;
Game_Actor.prototype.displayLevelUp = function(newSkills) {
    SkillTreesSystem.gameActorDisplayLevelUp.call(this, newSkills);

    if (SkillTreesSystem.pointsPerLevel > 0 && !SkillTreesSystem.useJP())
        $gameMessage.add(SkillTreesSystem.pointsPerLevel + " " + SkillTreesSystem._earnPointsText);
};

SkillTreesSystem.gameActorSetup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
    SkillTreesSystem.gameActorSetup.call(this, actorId);

    SkillTreesSystem.addActorTrees(this);
    SkillTreesSystem.addClassTrees(this);

    SkillTreesSystem.initActorFreePoints(this);
    SkillTreesSystem.initClassFreePoints(this);

    if (this.skillTrees && this.skillTrees.trees)
        this.skillTrees.trees.forEach(tree => tree.visibility = true)
};

SkillTreesSystem.initActorFreePoints = function (actor) {
    if (!SkillTreesSystem.actor2trees)
        return;

    let skillTrees = SkillTreesSystem.actor2trees[actor._actorId];

    if (skillTrees)
        actor.skillTrees.pts[0] = skillTrees.pts[0];
};

SkillTreesSystem.initClassFreePoints = function (actor, clsId) {
    if (!SkillTreesSystem.class2trees)
        return;

    if (!clsId)
        clsId = actor._classId;

    let skillTrees = SkillTreesSystem.class2trees[clsId];

    if (!skillTrees)
        return;

    if (SkillTreesSystem.singlePointsPool)
        actor.skillTrees.pts[0] += skillTrees.pts[0];
    else
        actor.skillTrees.pts[clsId] = skillTrees.pts[0];
};

SkillTreesSystem.addActorTrees = function(actor, actorId) {
    if (!SkillTreesSystem.actor2trees)
        return;

    if (!actorId)
        actorId = actor._actorId;

    let skillTrees = SkillTreesSystem.actor2trees[actorId];

    if (!skillTrees)
        return;

    skillTrees = skillTrees.clone();

    skillTrees.setActorId(actorId);

    if (actor.skillTrees)
        actor.skillTrees.trees = actor.skillTrees.trees.concat(skillTrees.trees);
    else
        actor.skillTrees = skillTrees;
};

SkillTreesSystem.addClassTrees = function(actor, clsId) {
    if (!SkillTreesSystem.class2trees)
        return;

    if (!clsId)
        clsId = actor._classId;

    let skillTrees = SkillTreesSystem.class2trees[clsId];

    if (!skillTrees)
        return;

    skillTrees = skillTrees.clone();

    skillTrees.setClassId(clsId);

    if (actor.skillTrees)
        actor.skillTrees.trees = actor.skillTrees.trees.concat(skillTrees.trees);
    else
        actor.skillTrees = skillTrees;
};

SkillTreesSystem.gameActorChangeClass = Game_Actor.prototype.changeClass;
Game_Actor.prototype.changeClass = function(classId, keepExp) {
    let oldClassId = this._classId;

    this._classChangeInProgress = true;

    SkillTreesSystem.gameActorChangeClass.call(this, classId, keepExp);

    this._classChangeInProgress = false;

    this.changeSkillTrees(oldClassId, classId);
};

SkillTreesSystem.gameActorChangeSubclass = Game_Actor.prototype.changeSubclass;
Game_Actor.prototype.changeSubclass = function(classId) {
    let oldClassId = this._subclassId;

    this._classChangeInProgress = true;

    SkillTreesSystem.gameActorChangeSubclass.call(this, classId);

    this._classChangeInProgress = false;

    this.changeSkillTrees(oldClassId, oldClassId === classId ? 0 : classId);
};

Game_Actor.prototype.changeSkillTrees = function(oldClassId, newClassId) {
    if (this !== $gameActors.actor(this._actorId) || oldClassId === newClassId)
        return;

    let needInit = true;

    for (let tree of this.skillTrees.trees) {
        if (tree._classId !== newClassId)
            continue;

        needInit = false;

        break;
    }

    if (needInit) {
        SkillTreesSystem.addClassTrees(this, newClassId);
        SkillTreesSystem.initClassFreePoints(this, newClassId);
    }

    for (let tree of this.skillTrees.trees) {
        if (oldClassId > 0 && tree._classId === oldClassId)
            tree.hide(this);

        if (tree._classId === newClassId)
            tree.relearn(this);
    }
};

//-----------------------------------------------------------------------------
// DataManager
//
// Handle game loading.

SkillTreesSystem.DataManagerExtractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    SkillTreesSystem.DataManagerExtractSaveContents.call(this, contents);

    for (let actor of $gameActors._data) {
        if (!actor || !actor.skillTrees)
            continue;

        let jsonTrees = actor.skillTrees.trees;
        let pts = actor.skillTrees.pts;
        actor.skillTrees = null;

        SkillTreesSystem.addActorTrees(actor);
        SkillTreesSystem.addClassTrees(actor);

        // Load current actor and class trees.
        SkillTreesSystem.loadTrees(jsonTrees, actor);
        // Load current other trees.
        SkillTreesSystem.loadOtherTrees(jsonTrees, actor);

        actor.skillTrees.pts = pts;

        actor.refresh();
    }
};

/**
 * Reconstruct JS object of Skill Trees System classes.
 *
 * @param jsonTrees Json object.
 * @param actor Actor.
 */
SkillTreesSystem.loadTrees = function (jsonTrees, actor) {
    if (!jsonTrees || !actor.skillTrees.trees)
        return;

    let i = 0;

    let loadedActorTrees = [actor._actorId];
    let loadedClassTrees = [actor._classId];

    while (i < jsonTrees.length) {
        let jsonTree = jsonTrees[i];

        if (jsonTree._actorId > 0 && !loadedActorTrees.contains(jsonTree._actorId)) {
            SkillTreesSystem.addActorTrees(actor, jsonTree._actorId);

            loadedActorTrees.push(jsonTree._actorId);
        }

        if (jsonTree._classId > 0 && !loadedClassTrees.contains(jsonTree._classId)) {
            SkillTreesSystem.addClassTrees(actor, jsonTree._classId);

            loadedClassTrees.push(jsonTree._classId);
        }

        for (let actorTree of actor.skillTrees.trees) {
            if (jsonTree.symbol !== actorTree.symbol)
                continue;

            actorTree.points = jsonTree.points;
            actorTree.visibility = jsonTree.visibility;

            SkillTreesSystem.loadSkills(jsonTree, actorTree, actor);

            jsonTrees.splice(i--, 1);

            break;
        }

        i++;
    }
};

/**
 * Reconstruct JS object of Skill Trees System classes.
 *
 * @param jsonTrees Json object.
 * @param actor Actor.
 */
SkillTreesSystem.loadOtherTrees = function(jsonTrees, actor) {
    if (!jsonTrees)
        return;

    let i = 0;

    while (i < jsonTrees.length) {
        let jsonTree = jsonTrees[i];

        for (let otherTree of SkillTreesSystem.otherTrees) {
            if (jsonTree.symbol !== otherTree.symbol)
                continue;

            let tree = otherTree.clone();

            tree.points = jsonTree.points;
            tree.visibility = jsonTree.visibility;

            SkillTreesSystem.loadSkills(jsonTree, tree, actor);

            jsonTrees.splice(i--, 1);

            actor.skillTrees.trees.push(tree);

            break;
        }

        i++;
    }
};

/**
 * Reconstruct JS object of Skill Trees System classes.
 *
 * @param jsonTree Json object.
 * @param actorTree STS object.
 * @param actor Actor.
 */
SkillTreesSystem.loadSkills = function(jsonTree, actorTree, actor) {
    if (!jsonTree.skills) {
        jsonTree.skills = [];

        return;
    }

    for (let jsonSkill of jsonTree.skills) {
        if (!jsonSkill || jsonSkill.type !== "skill")
            continue;

        for (let skill of actorTree.skills) {
            if (!skill || skill.type !== "skill" || skill.symbol !== jsonSkill.symbol)
                continue;

            skill.level = Math.min(skill.lvls.length, jsonSkill.level);

            skill.relearn(actor);
        }
    }
};

SkillTreesSystem.SceneItemBaseApplyItem = Scene_ItemBase.prototype.applyItem;
Scene_ItemBase.prototype.applyItem = function() {
    SkillTreesSystem.SceneItemBaseApplyItem.call(this);

    this.itemTargetActors().forEach(function(target) {
        if (this.item().meta.resetSkillTrees)
            SkillTreesSystem.resetSkillTrees(target, this.item().meta.resetSkillTrees);
    }, this);
};

/**
 * @param actor Actor.
 * @param target Target.
 */
SkillTreesSystem.resetSkillTrees = function(actor, target) {
    if (!actor.skillTrees)
        return;

    let points = 0;

    if (target === "all") {
        if (SkillTreesSystem.singlePointsPool) {
            for (let tree of actor.skillTrees.trees)
                points += SkillTreesSystem.resetSkillTree(actor, tree);

            actor.addTreesPoints(points, 0);
        } else {
            for (let tree of actor.skillTrees.trees) {
                points = SkillTreesSystem.resetSkillTree(actor, tree);

                if (tree._actorId > 0)
                    actor.addTreesPoints(points, 0);
                else if (tree._classId > 0)
                    actor.addTreesPoints(points, tree._classId);
                else
                    actor.addTreesPoints(points, tree.symbol);
            }
        }
    } else if (target === "actor") {
        for (let tree of actor.skillTrees.trees) {
            if (tree._actorId > 0) {
                points = SkillTreesSystem.resetSkillTree(actor, tree);

                actor.addTreesPoints(points, 0);
            }
        }
    } else {
        let treeId = target;

        if (treeId === 0) {
            console.warn("Unexpected class id to reset skills.");

            return;
        }

        for (let tree of actor.skillTrees.trees) {
            if (treeId != tree._classId && treeId !== tree.symbol)
                continue;

            let points = SkillTreesSystem.resetSkillTree(actor, tree);

            if (points > 0)
                actor.addTreesPoints(points, treeId);
        }
    }
};

/**
 * Reset actor skills for given tree.
 *
 * @param actor Actor.
 * @param tree Skill Tree object.
 * @return {number} Cost for reset skills.
 */
SkillTreesSystem.resetSkillTree = function(actor, tree) {
    let points = 0;

    for (let skill of tree.skills) {
        if (!skill || skill.type !== "skill" || skill.level === 0)
            continue;

        for (let i = 0; i < skill.level; i++) {
            for (let req of skill.reqs[i]) {
                if (req.type === "points")
                    points += req.price;
            }
        }

        skill.forget(actor);
        skill.level = 0;
    }

    tree.points = 0;

    actor.refresh();

    return points;
};

/**
 * Control characters for showing unspent skill points: "\SP[actorId]" and "\SP[actorId, treeId]".
 */
SkillTreesSystem.WindowBaseConvertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function (text) {
    text = SkillTreesSystem.WindowBaseConvertEscapeCharacters.call(this, text);

    text = text.replace(/\x1bSP\[(\d+),?\s*(\d*)\]/gi, function() {
        let actor = $gameActors.actor(parseInt(arguments[1]));
        let treeId = arguments[2];

        return actor.getTreesPoints(treeId === "" ? null : actor.skillTrees.getTree(treeId));
    }.bind(this));

    return text;
};
