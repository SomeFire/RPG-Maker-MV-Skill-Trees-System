# Usage and examples

SkillTreesConfig.js contains "how to" guide in description, and 3 chapters: 
* API - you can find script calls here.
* Skills Example - skills with different requirements and onLearn actions.
* Skill Trees Example - structure of whole skill tree and actor/class/other separation.

To create your own skill trees you must add skills and trees to SkillTreesConfig.js

# Structure

There are 3 entities: `Skill`, `Tree` and `SkillTrees`.
Actor have `SkillTrees` parameter, which is a container for all trees, and trees are containers for skills.

Let's start from the smallest object - `Skill`.
`Skill` is a JavaScript object, containing:
* symbol (identifier),
* array with skill IDs from RPG Maker,
* array with arrays of requirements per skill level,
* array with arrays of onLearn actions per skill level.

![Sample image](/tutorial/STS_Skill.png)

Now, let's talk about trees.
`SkillTree` is a JavaScript object, containing:
* displayable name,
* symbol (identifier),
* array of Skill objects.

![Sample image](/tutorial/STS_SkillTree.png)

At the end, `SkillTrees` - container for trees and skills:
* amount of free points, which player can spend to lvlup trees,
* array of skill trees.

It looks like
```
skillTrees(100, [
    skillTree(...),
    skillTree(...),
    skillTree(...)
    ])
```

# Auto binding trees to actors and classes

SkillTreesConfig.js contains 3 important objects:

`SkillTreesSystem.actor2trees` links actorId to SkillTrees object, 
so, at the game start all actors with given actorIds will have specified skill trees and free points to spend.
For example, if you described skill trees for actors with ID 1, 2 and 4, but not for 3, 
then third actor will not have actor trees. 

`SkillTreesSystem.class2trees` links classId to SkillTrees object,
so, at the game start all actors will have skill trees specified to their class.
For example, if you described skill trees for class with ID 1 only, 
then only actors with class 1 will have this skill trees. 

`SkillTreesSystem.otherTrees` is an array of SkillTree objects 
(not a SkillTrees like in `actor2trees` and `class2trees`).
This array is used for additional trees, not linked with actor or class.
For example, you can add them during the game when warrior learns new fighting style or mage learns new magic type.

# Custom arrows
`Arrow` is a JavaScript object linked with icon in IconSet.
So, to create your own arrows just add arrow images to your IconSet and create JavaScript objects like
```
arrowDown = new Arrow(28);
```
where number is iconId in IconSet.

