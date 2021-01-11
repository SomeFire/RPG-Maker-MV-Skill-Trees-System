//=============================================================================
// SkillTreesConfig.js
//=============================================================================

/*:
 * @plugindesc v1.9. Basic skill trees in a separate scene.
 *
 * @author SomeFire
 *
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 *
 * This is configuration plugin for Skill Trees System.
 * You should edit it in the any text editor to create your own skill trees.
 *
 * System structure:
 * a) Actor have SkillTrees object.
 * b) SkillTrees object have tree objects and skill points to spend for actor.
 * c) Tree object have name, symbol, class id, spent points and array of
 *    skill objects.
 * d) Skill object consist of 1 or more game skills and their requirements,
 *    which means it have an array of skill IDs and array of requirement arrays.
 *
 * Details about system objects you can read from jsdocs, but
 * what you really need is shown in example,
 * which starts from "Skills Example" section.
 *
 * Because it is Java*Cough*Script you should create trees in the end of file.
 *
 * ----------------------------------------------------------------------------
 * How to show scene with skill trees to player:
 *     SceneManager.push(Scene_SkillTrees)
 * ----------------------------------------------------------------------------
 * How to add tree:
 *     actor.addTree(skillTree);
 *
 *  skillTree - SkillTree object. You need to create it in the end of this file
 *     and add to `SkillTreesSystem.otherTrees` array.
 *
 *  Or use SkillTreesSystem.actor2trees and SkillTreesSystem.class2trees:
 *  trees described here are added automatically on the game start
 *  to the actors and actors with specified class respectively.
 * ----------------------------------------------------------------------------
 * How to hide tree:
 *     actor.hideTree(symbol);
 *
 *  symbol - Symbol of SkillTree object.
 * ----------------------------------------------------------------------------
 * How to add skill points:
 *     actor.addTreesPoints(points, classId);
 *
 *  points - number of points you want to give to the actor.
 *  classId - what actor's class will receive points. Optional parameter - will
 *      use single pool or current base class by default.
 * ----------------------------------------------------------------------------
 * How to get skill points:
 *     actor.getTreesPoints(skillTree);
 *
 *  skillTree - for which tree you want to know points. Optional parameter -
 *      will return points for single pool or current base class by default.
 * ----------------------------------------------------------------------------
 * How to reset skills:
 *     Use item with <resetSkillTrees:class_id> tag to reset trees
 *      for specific class only, where class_id is a number of the class.
 *     Use item with <resetSkillTrees:actor> tag to reset actor trees only
 *      (works with single pool only).
 *     Use item with <resetSkillTrees:all> tag to reset all trees,
 *      including actor trees (works with single pool only).
 * ----------------------------------------------------------------------------
 * How to learn skill by script call:
 *     SkillTreesSystem.forceLearn(actor, treeSymbol, skillId);
 *     SkillTreesSystem.tryLearn(actor, treeSymbol, skillId);
 *
 *  actor - actor, who should learn skill.
 *  treeSymbol - symbol of the tree, where to search given skill.
 *  skillId - skill ID from database.
 *
 *  `forceLearn` means skill will be learned, all requirements are ignored.
 *  `tryLearn` means skill will be learned only if actor meets requirements.
 * ----------------------------------------------------------------------------
 * How to learn all skills for tree by script call:
 *     SkillTreesSystem.forceLearnAll(actor, treeSymbol);
 *     SkillTreesSystem.tryLearnAll(actor, treeSymbol);
 *
 *  actor - actor, who should learn skill.
 *  treeSymbol - symbol of the tree, where skills will be learned.
 *  ----------------------------------------------------------------------------
 * How to learn all skills for all trees by script call:
 *     SkillTreesSystem.forceLearnAll(actor);
 *     SkillTreesSystem.tryLearnAll(actor);
 *
 *  actor - actor, who should learn skill.
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

//=============================================================================
// System Classes
//=============================================================================

/**
 * Interface for tree skill objects. There are only 2 implementations:
 * Skill object and arrow object.
 */
class TreeObject {
    constructor(type) {
        this.type = type;
    }
    iconId() {}
    isEnabled(actor, tree) {}
}

/**
 * Tree skill object.
 */
class Skill extends TreeObject {
    /**
     * @param symbol Symbol.
     * @param levels Array of skill IDs.
     * @param requirements Array of requirements for every skill level (array of arrays of requirements).
     * @param onLearnActions Array of onlearn actions for every skill level (array of arrays of actions).
     */
    constructor(symbol, levels, requirements, onLearnActions) {
        super("skill");
        this.symbol = symbol;
        this.lvls = levels;
        this.level = 0;
        this.reqs = requirements;
        this.learnActions = onLearnActions;
    }

    iconId() {
        return $dataSkills[this.lvls[0]].iconIndex;
    }

    isEnabled(actor, tree) {
        return this.level > 0 || this.isAvailableToLearn(actor, tree);
    }

    isAvailableToLearn(actor, tree) {
        if (this.level < 0 && this.level >= this.lvls.length)
            return false;

        var reqs = this.requirements();

        if (!reqs)
            return false;

        var res = true;

        for (let req of reqs)
            res &= req.meets(actor, tree);

        return res;
    }

    learn(actor, tree) {
        if (this.level < 0 && this.level >= this.lvls.length)
            return;

        var reqs = this.requirements();
        var onLearnActions = this.onLearnActions();

        // Reqs can't be null here.
        for (let req of reqs)
            req.use(actor, tree);

        this.levelUp(actor);

        if (!onLearnActions)
            return;

        for (let act of onLearnActions)
            act.action(actor, tree);
    }

    levelUp(actor, n) {
        if (!n)
            n = 1;

        n = Math.min(this.lvls.length, this.level + n);

        this.forget(actor);

        this.level = n;

        actor.learnSkill(this.lvls[this.level - 1]);

        actor.refresh();
    }

    forget(actor) {
        if (this.level > 0)
            actor.forgetSkill(this.lvls[this.level - 1]);
    }

    relearn(actor) {
        if (this.level > 0)
            actor.learnSkill(this.lvls[this.level - 1]);
    }

    currentLevel() {
        return this.level;
    }

    maxLevel() {
        return this.lvls.length;
    }

    nextLevel() {
        return $dataSkills[(this.level === this.lvls.length) ? this.lvls[this.level - 1] : this.lvls[this.level]];
    }

    requirements() {
        return (!this.reqs || this.level === this.lvls.length) ? null : this.reqs[this.level];
    }

    onLearnActions() {
        return (!this.learnActions || this.level === this.lvls.length) ? null : this.learnActions[this.level];
    }

    clone() {
        var copy = new Skill(this.symbol, this.lvls, this.reqs, this.learnActions);

        copy.level = this.level;

        return copy;
    }
}

/**
 * This object is used to draw arrows between skills in the skill tree.
 */
class Arrow extends TreeObject {
    /**
     * @param iconId Icon ID from the IconSet image.
     */
    constructor(iconId) {
        super("arrow");
        this._iconId = iconId;
    }

    iconId() {
        return this._iconId;
    }

    isEnabled(actor, tree) {
        return true;
    }
}

/**
 * This object represents single skill tree.
 */
class SkillTree {
    /**
     * @param name Tree name.
     * @param symbol Tree symbol.
     * @param treeObjs Array of tree objects. Should contain only skills, arrows and nulls.
     */
    constructor(name, symbol, treeObjs) {
        this.name = name;
        this.symbol = symbol;
        this.skills = treeObjs;
        this.points = 0;
        this._classId = 0;
        this._actorId = 0;
        this.visibility = false;
    }

    setActorId(actorId) {
        this._actorId = actorId;
    }

    setClassId(clsId) {
        this._classId = clsId;
    }

    isVisible() {
        return this.visibility;
    }

    hide(actor) {
        this.visibility = false;

        for (let skill of this.skills) {
            if (skill instanceof Skill)
                skill.forget(actor);
        }

        actor.refresh();
    }

    relearn(actor) {
        this.visibility = true;

        for (let skill of this.skills) {
            if (skill instanceof Skill)
                skill.relearn(actor);
        }

        actor.refresh();
    }

    clone() {
        var copy = new SkillTree();

        copy.name = this.name;
        copy.symbol = this.symbol;
        copy.points = this.points;
        copy._classId = this._classId;
        copy._actorId = this._actorId;
        copy.visibility = this.visibility;
        copy.skills = [];

        this.skills.forEach(function(skill, i, arr) {
            if (skill instanceof Skill)
                copy.skills.push(skill.clone());
            else
                copy.skills.push(skill);
        });

        return copy;
    }
}

/**
 * This object represents skill trees for actor.
 */
class SkillTrees {
    /**
     * @param freePoints Initial amount of free skill points.
     * @param trees Array of tree objects. Should contain only skills, arrows and nulls.
     */
    constructor(freePoints, trees) {
        if (!freePoints)
            freePoints = 0;

        if (!trees)
            trees = [];
        else if (trees instanceof SkillTree)
            trees = [trees];

        this.pts = {0: freePoints};
        this.trees = trees;
    }

    /**
     * Must be called only inside actor.getTreesPoints() (because we can't access JP from here).
     *
     * @param clsId Class id.
     * @returns {*}
     */
    _points(clsId) {
        // YEP job points are given in YEP plugins
        if (SkillTreesSystem.useJP())
            throw new Error("SkillTrees._points must be called only inside actor.getTreesPoints().");

        if (clsId == null)
            throw new ReferenceError("Unknown source for skill trees points.");

        if (!this.pts[clsId])
            this.pts[clsId] = 0;

        return this.pts[clsId];
    }

    /**
     * Must be called only inside actor.addTreesPoints() (because we can't access JP from here).
     *
     * @param val Value.
     * @param id Class id or tree symbol (for other trees).
     * @returns {*}
     */
    _addPoints(val, id) {
        // YEP job points are given in YEP plugins
        if (SkillTreesSystem.useJP())
            throw new Error("SkillTrees._addPoints must be called only inside actor.addTreesPoints().");

        if (SkillTreesSystem.singlePointsPool)
            id = 0;

        if (this.pts[id])
            this.pts[id] += val;
        else
            this.pts[id] = val;
    }

    setActorId(actorId) {
        for (let tree of this.trees)
            tree.setActorId(actorId);
    }

    setClassId(clsId) {
        for (let tree of this.trees)
            tree.setClassId(clsId);
    }

    getTree(symbol) {
        let res = null;

        this.trees.forEach(tree => {
            if (tree.symbol === symbol)
                res = tree;
        });

        return res;
    }

    clone() {
        let copy = new SkillTrees();

        for (let key in this.pts) {
            copy.pts[key] = this.pts[key];
        }

        this.trees.forEach(function(tree, i, arr) {
            copy.trees.push(tree.clone());
        });

        return copy;
    }
}

/**
 * Interface for skill requirements. See implementations.
 */
class Requirement {
    /**
     * @param type Requirement type.
     */
    constructor(type) {
        this.type = type;
    }

    /**
     * Requirement check.
     *
     * @param actor Actor
     * @param tree Tree
     * @returns {boolean} true - if actor meets requirement.
     */
    meets(actor, tree) {
        return false;
    }

    /**
     * @returns {string} Text shown for this requirement.
     */
    text() {
        return "";
    }

    /**
     * This method is called when skill is learned. It can be used for things like consuming skill points.
     *
     * @param actor
     * @param tree
     */
    use(actor, tree) {}
}

/**
 * Character should have some skill points to buy this skill.
 */
class Cost extends Requirement {
    constructor(price) {
		if (!price)
			price = 1;
		else if (price < 1)
			throw new RangeError("Price must be an integer greater than 0.");
		
        super("points");
        this.price = price;
    }

    meets(actor, tree) {
        return actor.getTreesPoints(tree) >= this.price;
    }

    text() {
        return this.price + " skill points";
    }

    use(actor, tree) {
        let treeId = 0;

        if (!SkillTreesSystem.singlePointsPool) {
            treeId = tree._classId;

            if (treeId === 0)
                treeId = tree.symbol;
        }

        actor.addTreesPoints(-this.price, treeId);
        tree.points += this.price;
    }
}

/**
 * Character should have some job points to buy this skill.
 */
class JPCost extends Requirement {
    constructor(price) {
        if (!price)
            price = 1;
        else if (price < 1)
            throw new RangeError("Price must be an integer greater than 0.");

        super("job points");
        this.price = price;
    }

    meets(actor, tree) {
        if (tree._classId > 0)
            return actor.jp(tree._classId) >= this.price;
        else
            throw new ReferenceError("Expected class tree. Tree name = " + tree.name);
    }

    text() {
        return this.price + " " + Yanfly.Param.Jp;
    }

    use(actor, tree) {
        actor.loseJp(this.price, tree._classId);
    }
}

/**
 * Character should be skilled enough in the same tree to meet this requirement.
 */
class TreePointsRequirement extends Requirement {
    constructor(points) {
		if (!points)
			points = 1;
		else if (points < 1)
			throw new RangeError("Points must be an integer greater than 0.");
		
        super("tree_points");
        this.points = points;
    }

    meets(actor, tree) {
        return tree.points >= this.points;
    }

    text() {
        return this.points + " tree points";
    }
}

/**
 * Character should know skill from the tree at some level.
 */
class SkillRequirement extends Requirement {
    /**
     * @param skill Skill tree object.
     * @param lvl Skill level.
     */
    constructor(skill, lvl) {
		if (!(skill instanceof Skill) && !(skill instanceof Array))
			throw new TypeError("Given object is not a Skill (TreeObject).");

		if (!lvl)
			lvl = 1;
		else if (lvl < 1)
			throw new RangeError("Skill level must be an integer greater than 0.");
		
        super("tree_skill_level");
        this.lvls = (skill instanceof Skill) ? skill.lvls : skill;
        this.lvl = lvl;
    }

    meets(actor, tree) {
        var res = false;

        for (var i = this.lvl - 1; i < this.lvls.length; i++)
            res |= actor.hasSkill(this.lvls[i]);

        return res;
    }

    text() {
        return $dataSkills[this.lvls[this.lvl - 1]].name + " learned";
    }
}

/**
 * Party should has some items.
 */
class ItemRequirement extends Requirement {
    /**
	 * @param dataClass 'item', 'weapon' or 'armor'.
	 * @param itemId Item ID.
	 * @param amount Amount of items needed to learn the skill. Default value = 1.
     */
    constructor(dataClass, itemId, amount) {
		if (dataClass !== 'item' && dataClass !== 'weapon' && dataClass !== 'armor')
			throw new TypeError("Illegal item type. Expected 'item', 'weapon' or 'armor', but was " + dataClass + ".");

		if (!amount)
			amount = 1;
		else if (amount < 1)
			throw new RangeError("Item amount must be an integer greater than 0.");
		
        super("item");
        this.dataClass = dataClass;
        this.itemId = itemId;
        this.amount = amount;
    }

    meets(actor, tree) {
        return $gameParty.numItems(this.item()) >= this.amount;
    }

    use(actor, tree) {
        $gameParty.gainItem(this.item(), -this.amount);
    }

    text() {
        return this.item().name + " x" + this.amount;
    }
	
	item() {
		if (this.dataClass = 'item') {
			return $dataItems[this.itemId];
		} else if (this.dataClass = 'weapon') {
			return $dataWeapons[this.itemId];
		} else if (this.dataClass = 'armor') {
			return $dataArmors[this.itemId];
		}

		throw new TypeError("Illegal item type. Expected 'item', 'weapon' or 'armor', but was " +
			this.dataClass + ".");
	}
}

/**
 * Character should have high level to meet this requirement.
 */
class LevelRequirement extends Requirement {
    /**
     * @param lvl Hero level.
     */
    constructor(lvl) {
		if (!lvl || lvl < 2)
			throw new RangeError("Hero level must be an integer greater than 1.");
		
        super("actor_level");
        this.lvl = lvl;
    }

    meets(actor, tree) {
        return actor._level >= this.lvl;
    }

    text() {
        return this.lvl + " hero level";
    }
}

/**
 * Game variable should be greater or equal to given value to meet this requirement.
 */
class VariableRequirement extends Requirement {
    /**
     * @param variableId Game variable ID.
     * @param intVal Game variable should be greater or equal to this value to meet requirement.
     */
    constructor(variableId, intVal) {
        if (!variableId)
            throw new TypeError("Unidentified variable ID.");

		if (!intVal || !((intVal ^ 0) === intVal))
			throw new RangeError("Required value must be an integer.");

        super("game_variable");
        this.varId = variableId;
        this.intVal = intVal;
    }

    meets(actor, tree) {
        return $gameVariables.value(this.varId) >= this.intVal;
    }

    text() {
        return this.intVal + " " + $dataSystem.variables[this.varId];
    }
}

/**
 * Game variable should be greater or equal to given value to meet this requirement.
 */
class SwitchRequirement extends Requirement {
    /**
     * @param switchId Game switch ID.
     * @param val Boolean true - if game switch should be set to meet requirement.
     * Boolean false - if game switch should be unset to meet requirement.
     * Default value = true.
     */
    constructor(switchId, val) {
        if (!switchId)
            throw new TypeError("Unidentified variable ID.");

		if (val === undefined)
			val = true;

        super("game_switch");
        this.switchId = switchId;
        this.val = val;
    }

    meets(actor, tree) {
        return $gameSwitches.value(this.switchId) === this.val;
    }

    text() {
        return $dataSystem.switches[this.switchId] + " must be " + (this.val ? "enabled" : "disabled");
    }
}

/**
 * Character should have enough stats to meet this requirement.
 */
class StatRequirement extends Requirement {
    /**
     * @param id Stat ID.
     * @param value Required stat value.
     */
    constructor(id, value) {
        if (!id)
            throw new TypeError("Unidentified stat id.");
        if (!value)
            throw new TypeError("Unidentified stat value.");
        if (!value)
            throw new TypeError("Unidentified stat text.");

        super("stat");

        this.id = id;
        this.val = value;
    }

    meets(actor, tree) {
        return actor.param(this.id) >= this.val;
    }

    text() {
        return this.val + " " + TextManager.param(this.id);
    }
}

/**
 * Interface for actions after skill learn. See implementations.
 */
class OnLearnAction {
    /**
     * @param type Requirement type.
     */
    constructor(type) {
        this.type = type;
    }

    /**
     * Will be called when actor learns appropriate level of skill.
     *
     * @param actor Actor, who learned a skill.
     * @param tree Tree containing learned skill.
     */
    action(actor, tree) {}
}

/**
 * Will change game variable by given increment.
 */
class OnLearnChangeVariable extends OnLearnAction {
    /**
     * @param variableId Game variable ID.
     * @param increment Variable value will be changed by this value. Default value = 1.
     */
    constructor(variableId, increment) {
        if (!variableId)
            throw new TypeError("Unidentified variable ID.");

        if (!increment)
            increment = 1;

        super("game_variable");
        this.varId = variableId;
        this.inc = increment;
    }

    action(actor, tree) {
        var oldVal = $gameVariables.value(this.varId);

        $gameVariables.setValue(this.varId, oldVal + this.inc)
    }
}

/**
 * Will call common event with specified ID.
 *
 * WARNING! Some event actions have no immediate effect, so, game can freezes until effect's end.
 * Or effect freezes while you are in the menu.
 * For example, text messages will appear only when you close menu and return to the map.
 */
class OnLearnCommonEvent extends OnLearnAction {
    /**
     * @param id Common event ID.
     */
    constructor(id) {
        super("common_event");
        this.id = id;
    }

    action(actor, tree) {
        let interpreter = $gameMap._interpreter;

        // backup
        let branch = interpreter._branch;
        let character = interpreter._character;
        let childInterpreter = interpreter._childInterpreter;
        let comments = interpreter._comments;
        let depth = interpreter._depth;
        let eventId = interpreter._eventId;
        let frameCount = interpreter._frameCount;
        let freezeChecker = interpreter._freezeChecker;
        let indent = interpreter._indent;
        let index = interpreter._index;
        let list = interpreter._list;
        let params = interpreter._params;
        let waitCount = interpreter._waitCount;
        let waitMode = interpreter._waitMode;

        // common event values
        interpreter._branch = null;
        interpreter._character = null;
        interpreter._childInterpreter = null;
        interpreter._comments = "";
        interpreter._depth = 0;
        interpreter._eventId = 0;
        interpreter._frameCount = 0;
        interpreter._freezeChecker = 0;
        interpreter._indent = 0;
        interpreter._index = 0;
        interpreter._list = $dataCommonEvents[this.id].list;
        interpreter._params = null;
        interpreter._waitCount = 0;
        interpreter._waitMode = "";

        // execute common event
        while (interpreter._index < interpreter._list.length) {
            if (OnLearnCommonEvent.isBusyWaiter(interpreter.currentCommand()) && $gameMessage.isBusy())
                interpreter._index++;
            else {
                interpreter.executeCommand();
                interpreter._waitMode = ""; // prevent waiting
            }
        }

        // return previous values
        interpreter._branch = branch;
        interpreter._character = character;
        interpreter._childInterpreter = childInterpreter;
        interpreter._comments = comments;
        interpreter._depth = depth;
        interpreter._eventId = eventId;
        interpreter._frameCount = frameCount;
        interpreter._freezeChecker = freezeChecker;
        interpreter._indent = indent;
        interpreter._index = index;
        interpreter._list = list;
        interpreter._params = params;
        interpreter._waitCount = waitCount;
        interpreter._waitMode = waitMode;
    }

    static isBusyWaiter(command) {
        if (command == null)
            return false;

        let code = command.code;

        return code >= 101 && code <= 105 || code === 201 || code === 221 || code === 222 || code === 261;
    }
}

//=============================================================================
// API
//=============================================================================

//-----------------------------------------------------------------------------
// Script Calls
//
// Use it when you need to do something manually.

/**
 * Add a skill tree to the actor.
 *
 * @param skillTreeObject {@link SkillTree SkillTree object}.
 */
Game_Actor.prototype.addTree = function(skillTreeObject) {
    if (!this.skillTrees)
        this.skillTrees = new SkillTrees();

    if (!skillTreeObject instanceof SkillTree)
        throw new TypeError("Expected a SkillTree object.");

    if (!SkillTreesSystem.otherTrees.contains(skillTreeObject)) {
        throw new ReferenceError("Expected a SkillTree object from `SkillTreesSystem.otherTrees` array. " +
            "Tree name = " + skillTreeObject.name);
    }

    this.skillTrees.trees.push(skillTreeObject);

    skillTreeObject.visibility = true;
};

/**
 * Hide specific skill tree for the actor.
 *
 * @param treeSymbol Tree symbol.
 */
Game_Actor.prototype.hideTree = function(treeSymbol) {
    this.skillTrees.getTree(treeSymbol).hide(this);
};

/**
 * Give some skill points to the actor.
 *
 * @param points Amount of points to give. Default value = 1.
 * @param treeId Class id or tree symbol. Default value = 0 (for single pool) or actor's base class id (for separate pools).
 */
Game_Actor.prototype.addTreesPoints = function(points, treeId) {
    if (SkillTreesSystem.useJP()) {
        this.gainJp(points, treeId);

        return;
    }

    if (!points && points !== 0)
        points = 1;

    if (!treeId) {
        if (SkillTreesSystem.singlePointsPool)
            treeId = 0;
        else
            treeId = this._classId;
    }

    if (!this.skillTrees)
        this.skillTrees = new SkillTrees();

    this.skillTrees._addPoints(points, treeId);
};

/**
 * Get actor's skill points.
 *
 * @param tree Skill tree.
 * @return Free points, which can be spent for given tree.
 * Optional parameter - will return points for single pool or current base class by default.
 */
Game_Actor.prototype.getTreesPoints = function(tree) {
    if (SkillTreesSystem.useJP())
        return this.jp((tree && tree._classId > 0) ? tree._classId : this._classId);

    if (SkillTreesSystem.singlePointsPool)
        return this.skillTrees._points(0);

    return this.skillTrees._points((tree && tree._classId > 0) ? tree._classId : tree.symbol);
};

/**
 * Try to learn skill for actor in specified tree.
 * Skill sublevels will be learned separately, and their requirements will be checked and used.
 *
 * @param actor Actor.
 * @param symbol SkillTree symbol.
 * @param skillId Skill ID from skill database. See `Skill.lvls`.
 */
SkillTreesSystem.tryLearn = function(actor, symbol, skillId) {
    SkillTreesSystem._learn(actor, symbol, skillId, false);
};

/**
 * Learn skill for actor in specified tree. Skill requirements will be ignored.
 * If you want to spend skill points or add skill points to the tree - you should to it manually.
 *
 * @param actor Actor.
 * @param symbol SkillTree symbol.
 * @param skillId Skill ID from skill database. See `Skill.lvls`.
 */
SkillTreesSystem.forceLearn = function(actor, symbol, skillId) {
    SkillTreesSystem._learn(actor, symbol, skillId, true);
};

/**
 * Learn skill for actor in specified tree.
 *
 * @param actor Actor.
 * @param symbol SkillTree symbol.
 * @param id Skill ID from skill database. See `Skill.lvls`.
 * @param force If true - skill requirements will be ignored.
 * If false - skill sublevels will be learned separately, and their requirements will be checked and used.
 * @private
 */
SkillTreesSystem._learn = function(actor, symbol, id, force) {
    if (!actor)
        throw new TypeError("Unidentified actor.");
    if (!symbol)
        throw new TypeError("Unidentified tree symbol.");
    if (!id)
        throw new TypeError("Unidentified database skill id.");

    let trees = actor.skillTrees.trees;

    for (let i = 0; i < trees.length; i++) {
        let tree = trees[i];

        if (tree.symbol === symbol) {
            let skills = tree.skills;

            for (let j = 0; j < skills.length; j++) {
                let skill = skills[j];

                if (skill == null || skill.type !== "skill")
                    continue;

                for (let k = 0; k < skill.lvls.length; k++) {
                    if (skill.lvls[k] !== id)
                        continue;

                    if (skill.level <= k) {
                        if (force)
                            skill.levelUp(actor, k + 1 - skill.level);
                        else {
                            while (skill.level <= k && skill.isAvailableToLearn(actor, tree))
                                skill.learn(actor, tree);
                        }
                    }

                    return;
                }
            }
        }
    }
};

/**
 * Learn all skills for actor in specified tree or for all trees if tree is not specified.
 * Skill requirements will be ignored.
 * If you want to spend skill points or add skill points to the tree - you should do it manually.
 *
 * @param actor Actor.
 * @param symbol SkillTree symbol. Optional parameter.
 */
SkillTreesSystem.forceLearnAll = function(actor, symbol) {
    if (!actor)
        throw new TypeError("Unidentified actor.");

    let trees = actor.skillTrees.trees;

    for (let i = 0; i < trees.length; i++) {
        let tree = trees[i];

        if (!symbol || tree.symbol === symbol) {
            let skills = tree.skills;

            for (let j = 0; j < skills.length; j++) {
                let skill = skills[j];

                if (skill !== null && skill.type === "skill")
                    skill.levelUp(actor, skill.lvls.length);
            }
        }
    }
};

/**
 * Try to learn all skills for actor in specified tree or for all trees if tree is not specified.
 * Skill sublevels will be learned separately, and their requirements will be checked and used.
 *
 * @param actor Actor.
 * @param symbol SkillTree symbol. Optional parameter.
 */
SkillTreesSystem.tryLearnAll = function(actor, symbol) {
    if (!actor)
        throw new TypeError("Unidentified actor.");

    let trees = actor.skillTrees.trees;
    let somethingLearned = true;

    while (somethingLearned) {
        somethingLearned = false;

        for (let i = 0; i < trees.length; i++) {
            let tree = trees[i];

            if (!symbol || tree.symbol === symbol) {
                let skills = tree.skills;

                for (let j = 0; j < skills.length; j++) {
                    let skill = skills[j];

                    if (skill === null || skill.type !== "skill")
                        continue;

                    while (skill.level <= skill.lvls.length && skill.isAvailableToLearn(actor, tree)) {
                        skill.learn(actor, tree);

                        somethingLearned = true;
                    }
                }
            }
        }
    }
};

//-----------------------------------------------------------------------------
// Shortcuts
//
// Remove tons of "new" keywords from JavaScript code and make it shorter!

/**
 * Character should have some skill points to buy this skill.
 *
 * @param price Price in skill points.
 */
function cost(price) {
    return new Cost(price);
}

/**
 * Character should have some job points to buy this skill.
 *
 * @param price Price in skill points.
 */
function jp(price) {
    return new JPCost(price);
}

/**
 * Character should be skilled enough in the same tree to meet this requirement.
 *
 * @param points Points.
 */
function treePoints(points) {
    return new TreePointsRequirement(points);
}

/**
 * Character should know skill from the tree at some level.
 *
 * @param skill Skill tree object.
 * @param lvl Skill level. Default value = 1.
 */
function skillReq(skill, lvl) {
    return new SkillRequirement(skill, lvl);
}

/**
 * Party should has some items.
 *
 * @param dataClass 'item', 'weapon' or 'armor'.
 * @param itemId Item ID.
 * @param amount Amount of items needed to learn the skill. Default value = 1.
 */
function itemReq(dataClass, itemId, amount) {
    return new ItemRequirement(dataClass, itemId, amount);
}

/**
 * Character should have high level to meet this requirement.
 *
 * @param level Hero level.
 */
function lvl(level) {
    return new LevelRequirement(level);
}

/**
 * @param variableId Game variable ID.
 * @param intValue Game variable should be greater or equal to this value to meet requirement.
 */
function varReq(variableId, intValue) {
    return new VariableRequirement(variableId, intValue);
}

/**
 * @param switchId Game switch ID.
 * @param val Boolean true - if game switch should be set to meet requirement.
 * Boolean false - if game switch should be unset to meet requirement.
 * Default value = true.
 */
function switchReq(switchId, val) {
    return new SwitchRequirement(switchId, val);
}

/**
 * @param variableId Game variable ID.
 * @param increment Variable value will be changed by this value. Default value = 1.
 */
function changeVar(variableId, increment) {
    return new OnLearnChangeVariable(variableId, increment);
}

/**
 * WARNING! Be careful, events can cause bugs - read OnLearnCommonEvent documentation.
 *
 * @param id Common event ID.
 * @return {OnLearnCommonEvent}
 */
function commonEvent(id) {
    return new OnLearnCommonEvent(id);
}

/**
 * Tree skill object.
 *
 * @param symbol Symbol.
 * @param skillIds Array of skill IDs.
 * @param requirements Array of requirements for every skill level.
 * @param onLearnActions On learn actions.
 */
function skill(symbol, skillIds, requirements, onLearnActions) {
    return new Skill(symbol, skillIds, requirements, onLearnActions);
}

/**
 * @param name Tree name.
 * @param symbol Tree symbol.
 * @param treeObjs Array of tree objects. Should contain only skills, arrows and nulls.
 */
function skillTree(name, symbol, treeObjs) {
    return new SkillTree(name, symbol, treeObjs);
}

/**
 * @param freePoints Initial amount of free skill points.
 * @param trees Array of tree objects. Should contain only skills, arrows and nulls.
 */
function skillTrees(freePoints, trees) {
    return new SkillTrees(freePoints, trees);
}

/**
 * @param value Actor's max HP value.
 * @return {StatRequirement}
 */
function mhp(value) {
    return new StatRequirement(0, value);
}

/**
 * @param value Actor's max MP value.
 * @return {StatRequirement}
 */
function mmp(value) {
    return new StatRequirement(1, value);
}

/**
 * @param value Actor's attack value.
 * @return {StatRequirement}
 */
function atk(value) {
    return new StatRequirement(2, value);
}

/**
 * @param value Actor's defence value.
 * @return {StatRequirement}
 */
function def(value) {
    return new StatRequirement(3, value);
}

/**
 * @param value Actor's magic atack value.
 * @return {StatRequirement}
 */
function mat(value) {
    return new StatRequirement(4, value);
}

/**
 * @param value Actor's magic defence value.
 * @return {StatRequirement}
 */
function mdf(value) {
    return new StatRequirement(5, value);
}

/**
 * @param value Actor's agility value.
 * @return {StatRequirement}
 */
function agi(value) {
    return new StatRequirement(6, value);
}

/**
 * @param value Actor's luck value.
 * @return {StatRequirement}
 */
function luk(value) {
    return new StatRequirement(7, value);
}

/**
 * @param value Actor's hit value.
 * @return {StatRequirement}
 */
function hit(value) {
    return new StatRequirement(8, value);
}

/**
 * @param value Actor's evasion value.
 * @return {StatRequirement}
 */
function eva(value) {
    return new StatRequirement(9, value);
}

//=============================================================================
// Skills Example
//=============================================================================

//-----------------------------------------------------------------------------
// Berserk
//

// This skill is a single-level skill.
guard = skill('guard', [2], [ // Skill ID from database skills.
    [cost(1)]        // Skill requirement. This skill cost 1 skill point.
]);
// This skill is a 3-level skill.
combatReflexes = skill('combatReflexes', [11, 12, 13], [ // Skill IDs from database skills.
    [cost(1)],                         // Skill requirement for 1 level (skill ID = 11)
    [cost(1)],                         // Skill requirement for 2 level (skill ID = 12)
    [cost(1)]                          // Skill requirement for 3 level (skill ID = 13)
]);
dualAttack = skill('dual', [3], [
    [cost(1), skillReq(combatReflexes, 1)] // Skill cost 1 skill point and requires 'combatReflexes' skill
]);                                        // learned at 1 level. Level can be skipped, see next skill.
doubleAttack = skill('double', [4], [
    [cost(1), lvl(3), skillReq(combatReflexes)] // Same as above, but can be learned by heroes with level 3 or above.
]);
tripleAttack = skill('triple', [5], [
    [cost(1), lvl(5), skillReq(combatReflexes, 2), skillReq(doubleAttack)] // Requires 2 skills.
]);
berserkerDance = skill('berserkerDance', [14], [
    [cost(3), skillReq(tripleAttack), itemReq('item', 1, 2)] // Requires 2 consumable items with ID 1.
]);
rampage = skill('rampage', [15], [
    [cost(3), treePoints(9), skillReq(combatReflexes, 3), skillReq(berserkerDance)]
]);
armorBreak = skill('armorBreak', [16, 17, 18], [
    [cost(1), treePoints(5), skillReq(berserkerDance)],
    [cost(2), atk(30)],
    [cost(3), itemReq('item', 1, 5)]
]);
spark = skill('spark', [10], [
    [cost(1)]
]);

//-----------------------------------------------------------------------------
// Berserk2 (sample with other requirements and on learn actions)
//

guard2 = skill('guard2', [2], [
    [cost(1), switchReq(1)], // Requires switch 1 to be true.
], [
    [changeVar(1, 2)] // On learn action, which increase the game variable 1 by 2.
]);
combatReflexes2 = skill('combatReflexes2', [11, 12, 13], [
    [cost(1)],          // Skill requirement for 1 level (skill ID = 11)
    [cost(1)],          // Skill requirement for 2 level (skill ID = 12)
    [cost(1)]           // Skill requirement for 3 level (skill ID = 13)
], [
     [changeVar(1, 1)], // On skill learn will increase the game variable 1 by 1.
     [changeVar(1, 2)], // On skill upgrade to second level will increase the game variable 1 by 2.
     [commonEvent(1)]   // On skill upgrade to third  level will call common event 1.
]);
dualAttack2 = skill('dual2', [3], [
    [cost(1), skillReq(combatReflexes2, 1), varReq(1, 2)] // Requires game variable 1 to be 2 or greater.
]);
doubleAttack2 = skill('double2', [4], [
    [cost(1), skillReq(combatReflexes2), lvl(3)]
]);
tripleAttack2 = skill('triple2', [5], [
    [cost(1), lvl(5), skillReq(combatReflexes2, 2), skillReq(doubleAttack2)]
]);
berserkerDance2 = skill('berserkerDance2', [14], [
    [cost(3), skillReq(tripleAttack2)]
]);
rampage2 = skill('rampage2', [15], [
    [cost(3), skillReq(combatReflexes2, 3), treePoints(9), skillReq(berserkerDance2)]
]);
armorBreak2 = skill('armorBreak2', [16, 17, 18], [
    [cost(1), treePoints(5), skillReq(berserkerDance2)],
    [cost(2)],
    [cost(3)]
]);

//-----------------------------------------------------------------------------
// Mage
//

fire = skill('fire', [118, 119, 120], [
    [cost(1)],
    [cost(2)],
    [cost(3)]
]);
flame = skill('flame', [121, 122, 123], [
    [cost(1), skillReq(fire, 1)],
    [cost(2), skillReq(fire, 2)],
    [cost(3), skillReq(fire, 3)]
]);
hellfire = skill('hellfire', [124, 125], [
    [cost(2), lvl(5), skillReq(flame, 1)],
    [cost(3), lvl(10), skillReq(flame, 2)]
]);
ice = skill('ice', [126, 127, 128], [
    [cost(1)],
    [cost(2)],
    [cost(3)]
]);
blizzard = skill('blizzard', [129, 130, 131], [
    [cost(1), skillReq(ice, 1)],
    [cost(2), skillReq(ice, 2)],
    [cost(3), skillReq(ice, 3)]
]);
hellfrost = skill('hellfrost', [132, 133], [
    [cost(2), lvl(5), skillReq(blizzard, 1)],
    [cost(3), lvl(10), skillReq(blizzard, 2)]
]);
enchanceWeapon = skill('enchanceWeapon', [390, 391, 392], [
    [cost(1)],
    [cost(2)],
    [cost(3)]
]);
magicShield = skill('magicShield', [393, 394, 395], [
    [cost(1)],
    [cost(2)],
    [cost(3)]
]);
concentration = skill('concentration', [396, 397, 398], [
    [cost(1)],
    [cost(2)],
    [cost(3)]
]);
blink = skill('blink', [449], [
    [cost(2), lvl(10)]
]);

//-----------------------------------------------------------------------------
// Human
//

firstAid = skill('firstAid', [440, 441, 442], [
    [cost(1)],
    [cost(2), lvl(5)],
    [cost(3), lvl(10)]
]);
ironSkin = skill('ironSkin', [443, 444, 445], [
    [cost(1)],
    [cost(2), lvl(5)],
    [cost(3), lvl(10)]
]);
ironWill = skill('ironWill', [446, 447, 448], [
    [cost(1)],
    [cost(2), lvl(5)],
    [cost(3), lvl(10)]
]);
secondWind = skill('secondWind', [449], [
    [cost(2), skillReq(firstAid), skillReq(ironSkin), skillReq(ironWill)]
]);

/**
 * Arrow pointing down.
 *
 * @type {Arrow}
 */
arrowDown = new Arrow(28);

/**
 * Arrow pointing from top left corner to right down.
 *
 * @type {Arrow}
 */
arrowDownRight = new Arrow(30);

/**
 * Arrow pointing from top right corner to left down.
 *
 * @type {Arrow}
 */
arrowDownLeft = new Arrow(29);

/**
 * Arrow pointing from left to right.
 *
 * @type {Arrow}
 */
arrowRight = new Arrow(15);

/**
 * Arrow pointing from right to left.
 *
 * @type {Arrow}
 */
arrowLeft = new Arrow(13);

//=============================================================================
// Skill Trees Example
//=============================================================================
// Null represents empty square in the skill window.
// Arrow points from one skill to another.
//
// If you want 1 tree for several actors/classes
// then you should declare it before `actor2trees`, `class2trees` and `otherTrees`.

SkillTreesSystem.humanTree = skillTree('Human', 'human_tree', [
    null,   firstAid,     null,             ironSkin,       null,           ironWill,   null,
    null,   null,         arrowDownRight,   arrowDown,      arrowDownLeft,  null,       null,
    null,   null,         null,             secondWind,     null,           null,       null
]);

/**
 * Contain trees setup tied to class ID. Trees will be added to actor on class initialization.
 *
 * @type {{"1": classId, "2": SkillTrees}}
 */
SkillTreesSystem.class2trees = {
    1: skillTrees(10, [ // Actor will receive additional points every time he takes new class.
        skillTree('Class 1', 'Class 1', [
            // Null represents empty square in the skill window.
            // Arrow points from one skill to another.
            null,   null,           null,          combatReflexes,     null,            guard,           null,
            null,   null,           arrowDownLeft, arrowDown,          null,            null,            null,
            null,   dualAttack,     null,          doubleAttack,       null,            null,            null,
            null,   null,           null,          arrowDown,          null,            spark,           null,
            null,   null,           null,          tripleAttack,       null,            null,            null,
            null,   null,           null,          arrowDown,          null,            null,            null,
            null,   null,           null,          berserkerDance,     null,            null,            null,
            null,   null,           null,          arrowDown,          arrowDownRight,  null,            null,
            null,   null,           null,          rampage,            null,            armorBreak,      null,
        ]),
        skillTree('Class 11', 'Class 11', [
            null,   null,           null,          combatReflexes,     null,       null,            null,
            null,   null,           arrowDownLeft, arrowDown,          null,       null,            null,
            null,   dualAttack,     null,          doubleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          tripleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          berserkerDance,     null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          rampage,            null,       null,            null,
        ])]
    ),
    2: skillTrees(20, [
        skillTree('Berserk', 'berserk_tree', [
            // Null represents empty square in the skill window.
            // Arrow points from one skill to another.
            null,   null,           null,          combatReflexes,     null,            guard,           null,
            null,   null,           arrowDownLeft, arrowDown,          null,            null,            null,
            null,   dualAttack,     null,          doubleAttack,       null,            null,            null,
            null,   null,           null,          arrowDown,          null,            spark,           null,
            null,   null,           null,          tripleAttack,       null,            null,            null,
            null,   null,           null,          arrowDown,          null,            null,            null,
            null,   null,           null,          berserkerDance,     null,            null,            null,
            null,   null,           null,          arrowDown,          arrowDownRight,  null,            null,
            null,   null,           null,          rampage,            null,            armorBreak,      null,
        ])]
    ),
    3: skillTrees(20, [
        skillTree('Mage', 'mage_tree', [
            null, fire,             arrowRight, flame,      arrowRight, hellfire,   null,
            null, null,             null,       null,       null,       null,       null,
            null, ice,              arrowRight, blizzard,   arrowRight, hellfrost,  null,
            null, null,             null,       null,       null,       null,       null,
            null, enchanceWeapon,   null,       null,       null,       null,       null,
            null, null,             null,       null,       null,       null,       null,
            null, magicShield,      null,       null,       null,       null,       null,
            null, null,             null,       null,       null,       null,       null,
            null, concentration,    null,       null,       null,       null,       null,
        ])]
    ),
    4: skillTrees(40, [
        skillTree('Class 4', 'class_4', [
            null,   null,           null,          null,               null,       guard,           null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       armorBreak,      null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
        ])]
    )
};

/**
 * Contain trees setup tied to actor ID. Trees will be added to actor on actor initialization.
 *
 * @type {{"1": actorId, "2": SkillTrees}}
 */
SkillTreesSystem.actor2trees = {
    1: skillTrees(100, [
        SkillTreesSystem.humanTree
    ]),
    2: skillTrees(100, [
        SkillTreesSystem.humanTree
    ]),
    3: skillTrees(100, [// Character will have 100 skill points to spend at the beginning.
        skillTree('Berserk2', 'berserk_tree2', [
            // Null represents empty square in the skill window.
            // Arrow points from one skill to another.
            null,   null,           null,          combatReflexes2,     null,           guard2,         null,
            null,   null,           arrowDownLeft, arrowDown,           null,           null,           null,
            null,   dualAttack2,    null,          doubleAttack2,       null,           null,           null,
            null,   null,           null,          arrowDown,           null,           null,           null,
            null,   null,           null,          tripleAttack2,       null,           null,           null,
            null,   null,           null,          arrowDown,           null,           null,           null,
            null,   null,           null,          berserkerDance2,     null,           null,           null,
            null,   null,           null,          arrowDown,           arrowDownRight, null,           null,
            null,   null,           null,          rampage2,            null,           armorBreak2,    null,
        ]),
        skillTree('Second Tree', 'second_tree', [
            null,   null,           null,          combatReflexes,     null,       null,            null,
            null,   null,           arrowDownLeft, arrowDown,          null,       null,            null,
            null,   dualAttack,     null,          doubleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          tripleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          berserkerDance,     null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          rampage,            null,       null,            null,
        ]),
        skillTree('Third Tree', 'third_tree', [
            null,   null,           null,          null,               null,       guard,           null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       armorBreak,      null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
        ]),
        SkillTreesSystem.humanTree
    ]),
    4: _sample_sameTreeSetupForDifferentActors(),
    5: _sample_sameTreeSetupForDifferentActors()
};

/**
 * @returns {SkillTrees} New SkillTrees object.
 * @private
 */
function _sample_sameTreeSetupForDifferentActors() {
    return skillTrees(100, [
        skillTree('Same Trees 1', 'same_trees_1', [
            null,   null,           null,          combatReflexes,     null,       guard,           null,
            null,   null,           arrowDownLeft, arrowDown,          null,       null,            null,
            null,   dualAttack,     null,          doubleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          tripleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          berserkerDance,     null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
        ]),
        skillTree('Same Trees 2', 'same_trees_2', [
            null,   null,           null,          combatReflexes,     null,       null,            null,
            null,   null,           arrowDownLeft, arrowDown,          null,       null,            null,
            null,   dualAttack,     null,          doubleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          tripleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          berserkerDance,     null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
        ]),
        skillTree('Same Trees 3', 'same_trees_3', [
            null,   null,           null,          null,               null,       guard,           null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       armorBreak,      null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
        ]),
        SkillTreesSystem.humanTree
    ])
}

SkillTreesSystem.separateTree = skillTree('Fourth Tree', 'f_tree', [
    null,   null,           null,          combatReflexes,     null,       null,            null,
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       armorBreak,      null,
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       null,            null,
]);

/**
 * This tree is used to check tree longer and wider than 1 page.
 * To see it normally - set {@link SkillTreesSystem#skillWindowMaxCols} to 11.
 */
SkillTreesSystem.bigTree = skillTree('Big Tree (see comments)', 'big_tree', [
    null,   null,           null,          combatReflexes,     null,            guard,           null,          combatReflexes,     null,           guard,           null,
    null,   null,           arrowDownLeft, arrowDown,          null,            null,            arrowDownLeft, arrowDown,          null,           null,            null,
    null,   dualAttack,     null,          doubleAttack,       null,            dualAttack,      null,          doubleAttack,       null,           null,            null,
    null,   null,           null,          arrowDown,          null,            spark,           null,          arrowDown,          null,           spark,           null,
    null,   null,           null,          tripleAttack,       null,            null,            null,          tripleAttack,       null,           null,            null,
    null,   null,           null,          arrowDown,          null,            null,            null,          arrowDown,          null,           null,            null,
    null,   null,           null,          berserkerDance,     null,            null,            null,          berserkerDance,     null,           null,            null,
    null,   null,           null,          arrowDown,          arrowDownRight,  null,            null,          arrowDown,          arrowDownRight, null,            null,
    null,   null,           null,          rampage,            null,            armorBreak,      null,          rampage,            null,           armorBreak,      null,
    null,   null,           arrowDownLeft, arrowDown,          null,            null,            arrowDownLeft, arrowDown,          null,           null,            null,
    null,   dualAttack,     null,          doubleAttack,       null,            dualAttack,      null,          doubleAttack,       null,           null,            null,
    null,   null,           null,          arrowDown,          null,            spark,           null,          arrowDown,          null,           spark,           null,
    null,   null,           null,          tripleAttack,       null,            null,            null,          tripleAttack,       null,           null,            null,
    null,   null,           null,          arrowDown,          null,            null,            null,          arrowDown,          null,           null,            null,
    null,   null,           null,          berserkerDance,     null,            null,            null,          berserkerDance,     null,           null,            null,
    null,   null,           null,          arrowDown,          arrowDownRight,  null,            null,          arrowDown,          arrowDownRight, null,            null,
    null,   null,           null,          rampage,            null,            armorBreak,      null,          rampage,            null,           armorBreak,      null,
    null,   null,           arrowDownLeft, arrowDown,          null,            null,            arrowDownLeft, arrowDown,          null,           null,            null,
    null,   dualAttack,     null,          doubleAttack,       null,            dualAttack,      null,          doubleAttack,       null,           null,            null,
    null,   null,           null,          arrowDown,          null,            spark,           null,          arrowDown,          null,           spark,           null,
    null,   null,           null,          tripleAttack,       null,            null,            null,          tripleAttack,       null,           null,            null,
    null,   null,           null,          arrowDown,          null,            null,            null,          arrowDown,          null,           null,            null,
    null,   null,           null,          berserkerDance,     null,            null,            null,          berserkerDance,     null,           null,            null,
    null,   null,           null,          arrowDown,          arrowDownRight,  null,            null,          arrowDown,          arrowDownRight, null,            null,
    null,   null,           null,          rampage,            null,            armorBreak,      null,          rampage,            null,           armorBreak,      null
]);

/**
 * Contain trees, which not belong to specific actor or class.
 * This array is used to load listed trees when player loading saved game.
 * Any tree must be inside of {@link SkillTreesSystem#actor2trees}, {@link SkillTreesSystem#class2trees} setups or
 * {@link SkillTreesSystem#otherTrees} array, otherwise it can't be loaded.
 */
SkillTreesSystem.otherTrees = [
    SkillTreesSystem.separateTree,
    SkillTreesSystem.bigTree,
    skillTree('Just Another Tree', 'jat', [
        null,   null,           null,          combatReflexes,     null,       null,            null,
        null,   null,           null,          null,               null,       null,            null,
    ])
];
