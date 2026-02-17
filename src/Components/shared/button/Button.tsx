//Importacion de button types
import {ButtonProps} from "./Button.types";

//Reutilizar la maquetacion de button
export const Button: React.FC<ButtonProps> = ({
    size = "medium", disabled = false,
    color = "blue", label, onClick,}) => {

    return(
        <button disabled={disabled} onClick={onClick}
         style={{
            background:color,
            padding: size === "small" ? "5px 25px": size === "large" ? "15px 30px" : "10px 20px",
            border: "none",
            borderRadius: "4px",
            color: "#000000ff",
            cursor: disabled ? "no-allowed" : "pointer",
            position: "relative",
            marginLeft: "0",
           
         }}
        >{label}</button>
    );
};