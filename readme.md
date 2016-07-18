

Installing ortools

cd drone/server

curl -o ortools.zip https://pypi.python.org/packages/dc/66/5c943f71e3a69bac976f0b194a87cc20f369307458bafa025b9c67f66934/ortools-3.3629-py2.7-linux-x86_64.egg#md5=5a4c7fc2f2f0c8f3f3f58611bf59a9cf

unzip -d tmp ortools.zip
mv tmp/ortools/ .
rm -r tmp
rm ortools.zip
