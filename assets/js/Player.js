// Factory that creates Player objects
export default function(order, name, marker) {
    return {
        order,
        name,
        marker,
        score: 0
    }
}