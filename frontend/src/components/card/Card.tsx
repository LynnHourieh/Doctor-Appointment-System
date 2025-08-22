import { femaleIcon, maleIcon } from "../../assets/images/icons";
import type { CardProps } from "../../models/components";
import Avatar from "../avatar/Avatar";
import Button from "../button/Button";
import "./card-style.scss"

const Card: React.FC<CardProps> = ({ fullName, email, id,gender, created_at, specialty, actionButtons=[],profileUrl }) => {
    return (
        <div className="card-container">

            <div className="card-avatar">
                <Avatar size="sm" src={profileUrl} />
            </div>
            <div className="card-content">
                <p className="card-name">{fullName} {gender === "male" ? maleIcon : femaleIcon}</p>
                {specialty && <p>{specialty}</p>}
                <p>{email}</p>
                <p>Registered: {created_at?.split("T")[0]}</p>
                <p>{id}</p>
                
            </div>
            <div className="card-action-buttons">
               {actionButtons?.map((buttonProps, index) => (
                   <Button key={index} {...buttonProps}  />
               ))}
            </div>

        </div>
    );
}

export default Card;