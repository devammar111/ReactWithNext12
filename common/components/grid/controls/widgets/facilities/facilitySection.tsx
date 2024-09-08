import { createContext, useContext } from "react";
import facilityItem from "@lib/umbraco/types/facility.type";
import Rte from "../../rte";
import { getCropUrl } from "@lib/umbraco/util/helpers";
import Image from "next/image";

export default function facilitySection(content : facilityItem) {
    
    return (
        <div>
            <Rte text={content.text} />

            <div>
                <Image src={getCropUrl(content.image, "fullImage")} width={content.image.width} height={content.image.height} alt={content.image.name} />
            </div>
        </div>
    )
}