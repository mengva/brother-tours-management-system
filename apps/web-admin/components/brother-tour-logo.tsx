import React from 'react'
import Image from "next/image";
import brotherToursLogo from "../public/images/brother_tours.png";

function BrotherTourLogoCom({
    width = 100,
    height = 100
}: {
    width: number;
    height: number;
}) {
    return <Image src={brotherToursLogo} alt="Logo" width={width || 100} height={height || 100} priority />
}

export default BrotherTourLogoCom
