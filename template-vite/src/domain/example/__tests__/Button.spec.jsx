import "@testing-library/jest-dom";
import Button from "../components/Button";
import { render } from "../utils/test-utils";

describe("[Button]", () => {
    test("Renders without crash", () => {
        render(<Button />);
        expect(true).toBeTruthy();
    });
});
