#include <iostream>
#include <vector>
using namespace std;

vector<int> circularArrayRotation(vector<int> a, int k, vector<int> queries) {
    vector<int> res;
    int len = a.size();
    k = k % len;

    for(auto i: queries){
        if (i < k) {
            int index = len - (k - i);
            
            res.push_back(a[index]);
        } else {
            res.push_back(a[i - k]);
        }
    }

    return res;
}