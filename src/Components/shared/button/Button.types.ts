
//Para poder utilizar los tipos de botones reutilizables
export interface ButtonProps {
    size?: ButtonSize;
    disabled?: boolean;
    color?: string;
    label: string;
    onClick?: () => void;
}

//Sobre los estilos con el botton reutilizable
export enum ButtonSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
}