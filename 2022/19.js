const sum = require('./sum');

function part1() {
    return input.split('\n').map(blueprint => {
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
            while(timestep < 24) {
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
            if(timestep == 24) {
                best = Math.max(best, geodeCount);
                return;
            }
            if(timestep > 24) {
                throw new Error("logic error, minute > 24");
            }

            // make an extremely conservative (high) guess on the maximum number of geodes from this timestep forward
            function getMaxGeode() {
                return geodeCount + geodeProduction * (24 - timestep) + (24 - timestep + 1) * (24 - timestep) / 2;
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

        return best * id;
    }).reduce(sum);
}

function part2() {

}

const input2 = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`

const input = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 16 clay. Each geode robot costs 4 ore and 16 obsidian.
Blueprint 2: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 4 ore and 8 obsidian.
Blueprint 3: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 18 clay. Each geode robot costs 4 ore and 16 obsidian.
Blueprint 4: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 7 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 5: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 7 clay. Each geode robot costs 2 ore and 16 obsidian.
Blueprint 6: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 17 clay. Each geode robot costs 4 ore and 8 obsidian.
Blueprint 7: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 20 clay. Each geode robot costs 2 ore and 19 obsidian.
Blueprint 8: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 10 clay. Each geode robot costs 4 ore and 10 obsidian.
Blueprint 9: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 4 ore and 19 clay. Each geode robot costs 4 ore and 7 obsidian.
Blueprint 10: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 19 clay. Each geode robot costs 3 ore and 13 obsidian.
Blueprint 11: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 12 clay. Each geode robot costs 3 ore and 15 obsidian.
Blueprint 12: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 14 clay. Each geode robot costs 4 ore and 11 obsidian.
Blueprint 13: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 10 clay. Each geode robot costs 2 ore and 10 obsidian.
Blueprint 14: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 16 clay. Each geode robot costs 3 ore and 14 obsidian.
Blueprint 15: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 20 clay. Each geode robot costs 3 ore and 14 obsidian.
Blueprint 16: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 10 clay. Each geode robot costs 2 ore and 14 obsidian.
Blueprint 17: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 6 clay. Each geode robot costs 2 ore and 10 obsidian.
Blueprint 18: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 20 obsidian.
Blueprint 19: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 20 clay. Each geode robot costs 3 ore and 14 obsidian.
Blueprint 20: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 8 clay. Each geode robot costs 2 ore and 10 obsidian.
Blueprint 21: Each ore robot costs 2 ore. Each clay robot costs 4 ore. Each obsidian robot costs 3 ore and 19 clay. Each geode robot costs 4 ore and 13 obsidian.
Blueprint 22: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 13 clay. Each geode robot costs 3 ore and 12 obsidian.
Blueprint 23: Each ore robot costs 3 ore. Each clay robot costs 4 ore. Each obsidian robot costs 2 ore and 20 clay. Each geode robot costs 4 ore and 7 obsidian.
Blueprint 24: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 7 clay. Each geode robot costs 3 ore and 9 obsidian.
Blueprint 25: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 13 clay. Each geode robot costs 2 ore and 9 obsidian.
Blueprint 26: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 7 clay. Each geode robot costs 4 ore and 17 obsidian.
Blueprint 27: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 19 clay. Each geode robot costs 3 ore and 17 obsidian.
Blueprint 28: Each ore robot costs 3 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 6 clay. Each geode robot costs 2 ore and 16 obsidian.
Blueprint 29: Each ore robot costs 4 ore. Each clay robot costs 4 ore. Each obsidian robot costs 4 ore and 7 clay. Each geode robot costs 2 ore and 19 obsidian.
Blueprint 30: Each ore robot costs 4 ore. Each clay robot costs 3 ore. Each obsidian robot costs 2 ore and 20 clay. Each geode robot costs 3 ore and 9 obsidian.`;

console.log(part1());
console.log(part2());
