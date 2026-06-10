#include <algorithm>
#include <iostream>
#include <string>
#include <vector>

struct ProductScore {
    std::string name;
    int score;
};

int main() {
    std::vector<ProductScore> products = {
        {"Midnight Track Jacket", 94},
        {"Ivory Signature Hoodie", 87},
        {"Monza Leather Cap", 79},
        {"Velocity Cargo Pants", 91}
    };

    std::sort(products.begin(), products.end(), [](const ProductScore& left, const ProductScore& right) {
        return left.score > right.score;
    });

    std::cout << "Corvette Store recommendation seed" << std::endl;
    for (const auto& product : products) {
        std::cout << product.name << " -> " << product.score << std::endl;
    }

    return 0;
}
