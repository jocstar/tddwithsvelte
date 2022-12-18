import "@testing-library/jest-dom";
import { reset } from "./src/locale/i18n"

// Global test aftereach for ALL tests
afterEach(reset);