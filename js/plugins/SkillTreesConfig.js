//=============================================================================
// SkillTreesConfig.js
//=============================================================================

/*:
 * @plugindesc v1.0 Basic skill trees in a separate scene.
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
 * How to bind trees to the actor:
 *     $gameActors.actor(actorId).skillTrees = SkillTreesSystem.actor2tree[actorId];
 *
 *  actor.skillTrees - is the new actor field.
 *  SkillTreesSystem.actor2tree - map containing trees for each actor.
 * ----------------------------------------------------------------------------
 * How to add skill points:
 *     $gameActors.actor(actorId).skillTrees.points += X;
 *
 *  X is points you want to give.
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
    constructor(levels, requirements) {
        super();
        this.lvls = levels;
        this.reqs = requirements;
        this.level = 0;
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

        // Reqs can't be null here.
        for (let req of this.requirements())
            req.use(actor, tree);

        this.levelUp(actor);
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
        return (this.level === this.lvls.length) ? null : this.reqs[this.level];
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
 * Character should have high level to meet this requirement.
 */
class LevelRequirement extends Requirement {
    /**
     * @param lvl Hero level.
     */
    constructor(lvl) {
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
 * @param lvl Skill level.
 */
function skillReq(skill, lvl) {
    return new SkillRequirement(skill, lvl ? lvl : 1);
}

/**
 * Character should have high level to meet this requirement.
 *
 * @param lvl Hero level.
 */
function lvl(level) {
    return new LevelRequirement(level);
}


/**
 * Tree skill object.
 *
 * @param levels Array of skill IDs.
 * @param requirements Array of requirements for every skill level.
 */
function skill(skillIds, requirements) {
    return new Skill(skillIds, requirements);
}

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
// Skills Example
//=============================================================================

// This skill is a single-level skill.
guard = skill([2], [ // Skill ID from database skills.
    [cost(1)]        // Skill requirement. This skill cost 1 skill point.
])
// This skill is a 3-level skill.
combatReflexes = skill([11, 12, 13], [ // Skill IDs
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
    [cost(3), skillReq(tripleAttack)]
]);
rampage = skill([15], [
    [cost(3), skillReq(combatReflexes, 3), treePoints(9), skillReq(berserkerDance)]
]);
armorBreak = skill([16, 17, 18], [
    [cost(1), treePoints(5), skillReq(berserkerDance)],
    [cost(2)],
    [cost(3)]
]);

//=============================================================================
// Skill Trees Example
//=============================================================================

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
    )

};
