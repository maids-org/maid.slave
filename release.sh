# ask for input and save it for variable
echo "Enter new version: "
read -r version

# edit version on package.json to input version
edit_version() {
  sed -i "s/\"version\": \".*\"/\"version\": \"$1\"/g" package.json
}

edit_version "$version"
git commit -am "v$version"
git tag "v$version"
git push && git push --tags

