const CoordinateDisplay = ({ coords }) => {
    return (
        <div style={{ zIndex: 3, position: "relative" }}>
            <span>Coordinates: </span>
            <span>X: {coords[0]}, </span>
            <span>Y: {coords[1]}</span>
        </div>
    );
};

export default CoordinateDisplay;