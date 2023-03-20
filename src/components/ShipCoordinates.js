const ShipCoordinates = ({ coords }) => {
    return (
        <div style={{ zIndex: 3, position: "relative" }}>
            <span>Ship: </span>
            <span>X: {coords[0]}, </span>
            <span>Y: {coords[1]}</span>
        </div>
    );
};

export default ShipCoordinates;