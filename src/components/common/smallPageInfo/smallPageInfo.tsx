import React from "react";
type SmallPageInfoProps = {
    title: string;
    description: string;
    icon?: React.ReactNode;
}
function SmallPageInfo({ title, description, icon = null }: SmallPageInfoProps) {
    return (
        <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {title}
            </h1>

            <p className="text-base text-gray-500">{description}</p>
        </div>
    );
}

export default SmallPageInfo;
