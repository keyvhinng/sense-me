#¡/usr/local/bin/python3
import numpy
from sklearn.feature_extraction import DictVectorizer
measurements = [
    {'city': 'Dubai', 'temperature': 33.},
    {'city': 'London', 'temperature':12.},
    {'city': 'San Francisco', 'temperature':18.}
]
vec = DictVectorizer()
vec.fit_transform(measurements).toarray()
print(vec.get_feature_names())
