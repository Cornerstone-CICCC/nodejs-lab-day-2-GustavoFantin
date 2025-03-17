// id (string uuid)
// - username (string)
// - password (string hashed)
// - firstname (string)
// - lastname (string)

export interface User {
    id: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
}