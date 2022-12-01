const sum = require('../sum');

function getMaxProduction(blueprint, minutes) {
    let match = blueprint.match(
        /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./
    );

    let id = parseInt(match[1]);
    let oreCostOre = parseInt(match[2]);
    let clayCostOre = parseInt(match[3]);
    let obsidianCostOre = parseInt(match[4]);
    let obsidianCostClay = parseInt(match[5]);
    let geodeCostOre = parseInt(match[6]);
    let geodeCostObsidian = parseInt(match[7]);

    let best = 0;
    function greedy() {
        let timestep = 1;
        let oreCount = 0;
        let oreProduction = 1;
        let clayCount = 0;
        let clayProduction = 0;
        let obsidianCount = 0;
        let obsidianProduction = 0;
        let geodeCount = 0;
        let geodeProduction = 0;
        while(timestep < minutes) {
            while(oreCount >= geodeCostOre && obsidianCount >= geodeCostObsidian) {
                oreCount -= geodeCostOre;
                obsidianCount -= geodeCostObsidian;
                ++geodeProduction;
                --geodeCount;
            }
            while(oreCount >= obsidianCostOre && clayCount >= obsidianCostClay) {
                oreCount -= obsidianCostOre;
                clayCount -= obsidianCostClay;
                ++obsidianProduction;
                --obsidianCount;
            }
            while(oreCount >= clayCostOre) {
                oreCount -= clayCostOre;
                ++clayProduction;
                --clayCount;
            }
            while(oreCount >= oreCostOre) {
                oreCount -= oreCostOre;
                ++oreProduction;
                --oreCount;
            }

            oreCount += oreProduction;
            clayCount += clayProduction
            obsidianCount += obsidianProduction;
            geodeCount += geodeProduction;
            ++timestep;
        }
        best = geodeCount;
    }
    greedy();

    function search(timestep, nextRobot, oreCount, oreProduction, clayCount, clayProduction, obsidianCount, obsidianProduction, geodeCount, geodeProduction) {
        if(timestep == minutes) {
            best = Math.max(best, geodeCount);
            return;
        }
        if(timestep > minutes) {
            throw new Error("logic error, timestep > minutes");
        }

        // make an extremely conservative (high) guess on the maximum number of geodes from this timestep forward
        function getMaxGeode() {
            return geodeCount + geodeProduction * (minutes - timestep) + (minutes - timestep + 1) * (minutes - timestep) / 2;
        }

        if(getMaxGeode() <= best) {
            return;
        }

        let builtRobot = false;
        if(nextRobot == 0) {
            // ore robot
            if(oreCount >= oreCostOre) {
                oreCount -= oreCostOre;
                ++oreProduction;
                --oreCount;
                builtRobot = true;
            }
        } else if(nextRobot == 1) {
            // clay robot
            if(oreCount >= clayCostOre) {
                oreCount -= clayCostOre;
                ++clayProduction;
                --clayCount;
                builtRobot = true;
            }
        } else if(nextRobot == 2) {
            // obsidian robot
            if(oreCount >= obsidianCostOre && clayCount >= obsidianCostClay) {
                oreCount -= obsidianCostOre;
                clayCount -= obsidianCostClay;
                ++obsidianProduction;
                --obsidianCount;
                builtRobot = true;
            }
        } else if(nextRobot == 3) {
            if(oreCount >= geodeCostOre && obsidianCount >= geodeCostObsidian) {
                oreCount -= geodeCostOre;
                obsidianCount -= geodeCostObsidian;
                ++geodeProduction;
                --geodeCount;
                builtRobot = true;
            }
        } else {
            throw new Error("logic error, bad robot type")
        }

        oreCount += oreProduction;
        clayCount += clayProduction;
        obsidianCount += obsidianProduction;
        geodeCount += geodeProduction;

        if(builtRobot) {
            search(timestep+1, 3, oreCount, oreProduction, clayCount, clayProduction, obsidianCount, obsidianProduction, geodeCount, geodeProduction);
            search(timestep+1, 2, oreCount, oreProduction, clayCount, clayProduction, obsidianCount, obsidianProduction, geodeCount, geodeProduction);
            search(timestep+1, 1, oreCount, oreProduction, clayCount, clayProduction, obsidianCount, obsidianProduction, geodeCount, geodeProduction);
            search(timestep+1, 0, oreCount, oreProduction, clayCount, clayProduction, obsidianCount, obsidianProduction, geodeCount, geodeProduction);
        } else {
            search(timestep+1, nextRobot, oreCount, oreProduction, clayCount, clayProduction, obsidianCount, obsidianProduction, geodeCount, geodeProduction);
        }
    }

    search(0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    search(0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

    return {best, id};
}

function part1() {
    return input.split('\n').map(blueprint => {
        let {best, id} = getMaxProduction(blueprint, 24);
        return best * id;
    }).reduce(sum);
}

function part2() {
    function product(a,b) {
        return a*b;
    }

    return input.split('\n').slice(0, 3).map(blueprint => {
        let {best} = getMaxProduction(blueprint, 32);
        return best;
    }).reduce(product);
}

const input = require("../input/2022/19.js");

console.log(part1());
console.log(part2());
