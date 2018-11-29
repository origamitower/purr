module Tests.Main

// NOTE: this hack's only here because `allFiles` causes fable to try to
//       compile even the dependencies we don't use, and it fails :/
#if FABLE_COMPILER
open Fable.Core.JsInterop

importSideEffects "./parsing/Grammar.test.fs"
#endif

