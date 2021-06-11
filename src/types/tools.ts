// This custom Override type is leveraging the Omit special type

// Omit constructs a type by picking all properties from Type and 
// then removing Keys (string literal or union of string literals).

type Override<T, R> = Omit<T, keyof R> & R;

export default Override;


// In this case: Override takes 2 generics in
// Omit is returing an element of type T, but without any node which is also keyof R


// e.g.

type User = {
    id: number;
    name: string;
    createdAt: Date
}

type _UserWithStringDate = Override<User, { createdAt: string }>

// Omit is "omitting" the "createdAt" key from User -> because "createdAt" is keyof { createdAt: string }
// -> then, the resulting type is added to { createdAt: string } so the final resulting type is 

// { 
//     id: number;
//     name: string;
//     createdAt: string
// }