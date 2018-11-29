# Origami design

This folder contains documents describing the design of all features in Origami. The current process is simple:

- Proposals start in the `Idea` state, and can be discussed until accepted or rejected;
- Accepted proposals require an experimental implementation and more technical discussions on its computational aspects (performance, memory usage, security, optimisability, etc);
- Accepted proposals may be shipped, and then they're moved to the `Finished` state.

Which basically means:

    [idea] -- (discuss) --> [accepted] -- (implement) --> [finished] -- (ship)
                  |                            |
                  |                            |
                  v                            |
              [rejected] <---------------------´
