//=============================================================================
// SkillTreesConfig.js
//=============================================================================

/*:
 * @plugindesc v1.1 Basic skill trees in a separate scene.
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
 * c) Tree object have name, symbol, spent points and array of skill objects.
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
 * How to bind group of trees to the actor:
 *     actor.setSkillTrees(skillTreesObjectId);
 *
 *  skillTreesObjectId - ID of SkillTrees object. Usually the same as actor ID.
 *   You need to create trees in the SkillTreesSystem.actor2tree field.
 * ----------------------------------------------------------------------------
 * How to add tree:
 *     actor.addTree(skillTree);
 *
 *  skillTree - SkillTree object. You need to create it in the end of this file.
 * ----------------------------------------------------------------------------
 * How to add skill points:
 *     actor.addTreesPoints(points);
 *
 *  points - number of points you want to give to the actor.
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
 * - Added on skill learn action to change game variables.
 *
 */

//=============================================================================
// System Variables
//=============================================================================

var SkillTreesSystem = SkillTreesSystem || {};

SkillTreesSystem.freePointsText = function() {
    return "SP: "
};

SkillTreesSystem.treePointsText = function(tree) {
    return "SP in " + tree.name + ": ";
};

SkillTreesSystem.requirementsText = function() {
    return "Requirements:";
};

//=============================================================================
// System Classes
//=============================================================================

/**
 * Interface for tree skill objects. There are only 2 implementations:
 * Skill object and arrow object.
 */
class TreeObject {
    iconId() {}
    isEnabled(actor, tree) {}
}

/**
 * Tree skill object.
 */
class Skill extends TreeObject {
    /**
     * @param levels Array of skill IDs.
     * @param requirements Array of requirements for every skill level.
     */
    constructor(levels, requirements, onLearnActions) {
        super();
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
            act.action();
    }

    levelUp(actor, n) {
        if (!n)
            n = 1;

        n = Math.min(this.lvls.length, this.level + n);

        if (this.level > 0)
            actor.forgetSkill(this.lvls[this.level - 1]);

        this.level = n;

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
}

/**
 * This object is used to draw arrows between skills in the skill tree.
 */
class Arrow extends TreeObject {
    /**
     * @param iconId Icon ID from the IconSet image.
     */
    constructor(iconId) {
        super();
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
    }
}

/**
 * This object represents skill trees for actor.
 */
class SkillTrees {
    constructor(freePoints, trees) {
        if (!freePoints)
            freePoints = 0;

        if (!trees)
            trees = [];
        else if (trees instanceof SkillTree)
            trees = [trees];

        this.points = freePoints;
        this.trees = trees;
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
        return actor.skillTrees.points >= this.price;
    }

    text() {
        return this.price + " skill points";
    }

    use(actor, tree) {
        actor.skillTrees.points -= this.price;
        tree.points += this.price;
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
		if (!(skill instanceof Skill))
			throw new TypeError("Given object is not a Skill (TreeObject).");

		if (!lvl)
			lvl = 1;
		else if (lvl < 1)
			throw new RangeError("Skill level must be an integer greater than 0.");
		
        super("tree_skill_level");
        this.lvls = skill.lvls;
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
		if (dataClass != 'item' && dataClass != 'weapon' && dataClass != 'armor') {
			throw new TypeError("Illegal item type. Expected 'item', 'weapon' or 'armor', but was " +
				this.dataClass + ".");
		}

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
 * Interface for actions after skill learn. See implementations.
 */
class OnLearnAction {
    action() {}
}

/**
 * Will change game variable by given increment.
 */
class OnLearnChangeVariable extends OnLearnAction {
    /**
     * @param variableId Game variable ID.
     * @param increment Variable value will be changed by this value.
     */
    constructor(variableId, increment) {
        super();
        this.varId = variableId;
        this.inc = increment;
    }

    action() {
        var oldVal = $gameVariables.value(this.varId);

        $gameVariables.setValue(this.varId, oldVal + this.inc)
    }
}

/**
 * Character should have some skill points to buy this skill.
 *
 * @param price Price in skill points.
 */
function cost(price) {
    return new Cost(price);
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
 * @param increment Variable value will be changed by this value.
 */
function changeVar(variableId, increment) {
    return new OnLearnChangeVariable(variableId, increment);
}

/**
 * Tree skill object.
 *
 * @param skillIds Array of skill IDs.
 * @param requirements Array of requirements for every skill level.
 */
function skill(skillIds, requirements, onLearnActions) {
    return new Skill(skillIds, requirements, onLearnActions);
}

//=============================================================================
// API
//=============================================================================

/**
 * Setup actor's skill trees.
 *
 * @param skillTreesObjectId SkillTrees ID. Usually it is actor ID.
 * See {@link SkillTreesSystem.actor2tree}.
 */
Game_Actor.prototype.setSkillTrees = function(skillTreesObjectId) {
    if (!SkillTreesSystem.actor2tree[skillTreesObjectId])
        throw new ReferenceError("No such SkillTrees object.");

    this.skillTrees = SkillTreesSystem.actor2tree[skillTreesObjectId];
};

/**
 * Add a skill tree to the actor.
 *
 * @param skillTreeObject {@link SkillTree SkillTree object}.
 */
Game_Actor.prototype.addTree = function(skillTreeObject) {
    if (!this.skillTrees)
        this.skillTrees = new SkillTrees();

    if (!skillTreeObject instanceof SkillTree)
        throw new TypeError("You should add a new SkillTree object.");

    this.skillTrees.trees.push(skillTreeObject);
};

/**
 * Give some skill points to the actor.
 *
 * @param points Amount of points to give.
 */
Game_Actor.prototype.addTreesPoints = function(points) {
    if (!points)
        points = 1;

    if (!this.skillTrees)
        this.skillTrees = new SkillTrees(points);

    this.skillTrees.points += points;
};

//=============================================================================
// Skills Example
//=============================================================================

// This skill is a single-level skill.
guard = skill([2], [ // Skill ID from database skills.
    [cost(1)]        // Skill requirement. This skill cost 1 skill point.
]);
// This skill is a 3-level skill.
combatReflexes = skill([11, 12, 13], [ // Skill IDs from database skills.
    [cost(1)],                         // Skill requirement for 1 level (skill ID = 11)
    [cost(1)],                         // Skill requirement for 2 level (skill ID = 12)
    [cost(1)]                          // Skill requirement for 3 level (skill ID = 13)
]);
dualAttack = skill([3], [
    [cost(1), skillReq(combatReflexes, 1)] // Skill cost 1 skill point and requires 'combatReflexes' skill
]);                                        // learned at 1 level. Level can be skipped, see next skill.
doubleAttack = skill([4], [
    [cost(1), skillReq(combatReflexes), lvl(3)] // Same as above, but can be learned by heroes with level 3 or above.
]);
tripleAttack = skill([5], [
    [cost(1), lvl(5), skillReq(combatReflexes, 2), skillReq(doubleAttack)] // Requires 2 skills.
]);
berserkerDance = skill([14], [
    [cost(3), skillReq(tripleAttack), itemReq('item', 1, 2)] // Requires 2 consumable items with ID 1.
]);
rampage = skill([15], [
    [cost(3), skillReq(combatReflexes, 3), treePoints(9), skillReq(berserkerDance)]
]);
armorBreak = skill([16, 17, 18], [
    [cost(1), treePoints(5), skillReq(berserkerDance)],
    [cost(2)],
    [cost(3), itemReq('item', 1, 5)]
]);


guard2 = skill([2], [
    [cost(1)],
], [
    [changeVar(1, 2)] // On learn action, which increase the game variable 1 by 2.
]);
combatReflexes2 = skill([11, 12, 13], [
    [cost(1)],
    [cost(1)],
    [cost(1)]
], [
     [changeVar(1, 1)], // On skill learn will increase the game variable 1 by 1.
     [changeVar(1, 2)], // On skill upgrade to second level will increase the game variable 1 by 2.
     [changeVar(1, 3)]  // On skill upgrade to third  level will increase the game variable 1 by 3.
]);
dualAttack2 = skill([3], [
    [cost(1), skillReq(combatReflexes2, 1)]
]);
doubleAttack2 = skill([4], [
    [cost(1), skillReq(combatReflexes2), lvl(3)]
]);
tripleAttack2 = skill([5], [
    [cost(1), lvl(5), skillReq(combatReflexes2, 2), skillReq(doubleAttack2)]
]);
berserkerDance2 = skill([14], [
    [cost(3), skillReq(tripleAttack2)]
]);
rampage2 = skill([15], [
    [cost(3), skillReq(combatReflexes2, 3), treePoints(9), skillReq(berserkerDance2)]
]);
armorBreak2 = skill([16, 17, 18], [
    [cost(1), treePoints(5), skillReq(berserkerDance2)],
    [cost(2)],
    [cost(3)]
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
arrowRight = new Arrow(30);

/**
 * Arrow pointing from top right corner to left down.
 *
 * @type {Arrow}
 */
arrowLeft = new Arrow(29);

//=============================================================================
// Skill Trees Example
//=============================================================================

/**
 * Contain trees setup tied to actor ID.
 *
 * @type {{"1": actorId, "2": SkillTrees}}
 */
SkillTreesSystem.actor2tree = {
    1: new SkillTrees(55, // Character will have 55 skill points to spend at the begining.
        [new SkillTree('Berserk', 'berserk_tree', [
            // Null represents empty square in the skill window.
            // Arrow points from one skill to another.
            null,   null,           null,          combatReflexes,     null,       guard,           null,
            null,   null,           arrowLeft,     arrowDown,          null,       null,            null,
            null,   dualAttack,     null,          doubleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          tripleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          berserkerDance,     null,       null,            null,
            null,   null,           null,          arrowDown,          arrowRight, null,            null,
            null,   null,           null,          rampage,            null,       armorBreak,      null,
        ]), new SkillTree('Second Tree', 'second_tree', [
            null,   null,           null,          combatReflexes,     null,       null,            null,
            null,   null,           arrowLeft,     arrowDown,          null,       null,            null,
            null,   dualAttack,     null,          doubleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          tripleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          berserkerDance,     null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          rampage,            null,       null,            null,
        ]), new SkillTree('Third Tree', 'third_tree', [
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
    ),
    2: new SkillTrees(55,
        [new SkillTree('Berserk', 'berserk_tree', [
            null,   null,           null,          combatReflexes2,     null,       guard2,           null,
            null,   null,           arrowLeft,     arrowDown,          null,       null,            null,
            null,   dualAttack2,     null,          doubleAttack2,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          tripleAttack2,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          berserkerDance2,     null,       null,            null,
            null,   null,           null,          arrowDown,          arrowRight, null,            null,
            null,   null,           null,          rampage2,            null,       armorBreak2,      null,
        ])]
    ),
    3: _sample_sameTreeSetupForDifferentActors(),
    4: _sample_sameTreeSetupForDifferentActors()
};

/**
 * @returns {SkillTrees} New SkillTrees object.
 * @private
 */
function _sample_sameTreeSetupForDifferentActors() {
    return new SkillTrees(55,
        [new SkillTree('Same Trees 1', 'same_trees_1', [
            // Null represents empty square in the skill window.
            // Arrow points from one skill to another.
            null,   null,           null,          combatReflexes,     null,       guard,           null,
            null,   null,           arrowLeft,     arrowDown,          null,       null,            null,
            null,   dualAttack,     null,          doubleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          tripleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          berserkerDance,     null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
        ]), new SkillTree('Same Trees 2', 'same_trees_2', [
            null,   null,           null,          combatReflexes,     null,       null,            null,
            null,   null,           arrowLeft,     arrowDown,          null,       null,            null,
            null,   dualAttack,     null,          doubleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          tripleAttack,       null,       null,            null,
            null,   null,           null,          arrowDown,          null,       null,            null,
            null,   null,           null,          berserkerDance,     null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
            null,   null,           null,          null,               null,       null,            null,
        ]), new SkillTree('Same Trees 3', 'same_trees_3', [
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
}

SkillTreesSystem.fTree = new SkillTree('Fourh Tree', 'f_tree', [
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       armorBreak,      null,
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       null,            null,
    null,   null,           null,          null,               null,       null,            null,
]);
