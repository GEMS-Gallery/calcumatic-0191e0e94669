import Text "mo:base/Text";

import Float "mo:base/Float";
import Debug "mo:base/Debug";

actor Calculator {
  public func calculate(operation: Text, num1: Float, num2: Float) : async Float {
    switch (operation) {
      case ("+") { return num1 + num2; };
      case ("-") { return num1 - num2; };
      case ("*") { return num1 * num2; };
      case ("/") {
        if (num2 == 0) {
          Debug.trap("Division by zero");
        };
        return num1 / num2;
      };
      case (_) {
        Debug.trap("Invalid operation");
      };
    };
  };
}