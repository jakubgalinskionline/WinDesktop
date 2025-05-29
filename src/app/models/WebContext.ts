import { UserDto } from "./UserDto";

export interface WebContext {
    title: string;
    subtitle: string;
    user: UserDto;   
}