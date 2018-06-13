Should Origami provide additional support for runtime-reflection? Should we encourage people to use compile-time reflection instead (which isn't gonna be accessible by source written in other languages)?

How do we handle tooling support and keep up with TypeScript? It's probably a good idea to integrate TS and Origami somehow (maybe adding support for custom front-ends to the TS compiler?)

Some operations in Origami are kinda inefficient now. Should we consider automatic specialisation from type information? Should we expect users to use unsafe functions instead (and then maybe special-case those?)
