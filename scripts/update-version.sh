#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
eval JS_API=true
eval GNU=false
eval EXEC_COMPONENT=true
eval DIFFERENT_JS_API=false
eval AUTO=false

eval projects=( "core"
    "content-services"
    "process-services"
    "insights" )

cd `dirname $0`

prefix="@alfresco\/adf-"

show_help() {
    echo "Usage: update-version.sh"
    echo ""
    echo "-sj or -sjsapi  don't update js-api version"
    echo "-vj or -versionjsapi  to use a different version of js-api"
    echo "-demoshell execute the change version only in the demo shell "
    echo "-v or -version  version to update"
    echo "-nextalpha update next alpha version of js-api and lib automatically"
    echo "-nextbeta update next beta version of js-api and lib automatically"
    echo "-alpha update last alpha version of js-api and lib automatically"
    echo "-beta update beta alpha version of js-api and lib automatically"
    echo "-gnu for gnu"
}

skip_js() {
    echo "====== Skip JS-API change version $1 ====="
    JS_API=false
}

last_alpha_mode() {
    echo "====== Auto find last ALPHA version ====="
    VERSION=$(npm view @alfresco/adf-core@alpha version)

    echo "====== version lib ${VERSION} ====="

    DIFFERENT_JS_API=true
    VERSION_JS_API=$(npm view alfresco-js-api@alpha version)

    echo "====== version js-api ${DIFFERENT_JS_API} ====="
}

next_alpha_mode() {
    echo "====== Auto find next ALPHA version ====="
    VERSION=$(./next_version.sh -minor -alpha)

    echo "====== version lib ${VERSION} ====="

    DIFFERENT_JS_API=true
    VERSION_JS_API=$(npm view alfresco-js-api@alpha version)

    echo "====== version js-api ${DIFFERENT_JS_API} ====="
}

next_beta_mode() {
    echo "====== Auto find next BETA version ====="
    VERSION=$(./next_version.sh -minor -beta)

    echo "====== version lib ${VERSION} ====="

    DIFFERENT_JS_API=true
    VERSION_JS_API=$(npm view alfresco-js-api@beta version)

    echo "====== version js-api ${DIFFERENT_JS_API} ====="
}

last_beta_mode() {
    echo "====== Auto find last BETA version ====="
    VERSION=$(npm view @alfresco/adf-core@beta version)

    echo "====== version lib ${VERSION} ====="

    DIFFERENT_JS_API=true
    VERSION_JS_API=$(npm view alfresco-js-api@beta version)

    echo "====== version js-api ${DIFFERENT_JS_API} ====="
}

gnu_mode() {
    echo "====== GNU MODE ====="
    GNU=true
}

version_change() {
    echo "====== New version $1 ====="
    VERSION=$1
}

version_js_change() {
    echo "====== Alfresco JS-API version $1 ====="
    VERSION_JS_API=$1
    DIFFERENT_JS_API=true
}

update_component_version() {
   echo "====== UPDATE PACKAGE VERSION of ${PACKAGE} to ${VERSION} version in all the package.json ======"
   DESTDIR="$DIR/../lib/${1}"
   sed "${sedi[@]}" "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
}

update_component_dependency_version(){
   DESTDIR="$DIR/../lib/${1}"

   for (( j=0; j<${projectslength}; j++ ));
    do
       echo "====== UPDATE DEPENDENCY VERSION of .* to ~${VERSION} in ${1}======"

       sed "${sedi[@]}" "s/\"${prefix}${projects[$j]}\": \".*\"/\"${prefix}${projects[$j]}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${prefix}${projects[$j]}\": \"~.*\"/\"${prefix}${projects[$j]}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${prefix}${projects[$j]}\": \"^.*\"/\"${prefix}${projects[$j]}\": \"^${VERSION}\"/g"  ${DESTDIR}/package.json

    done
}

update_total_build_dependency_js_version(){
    echo "====== UPDATE DEPENDENCY VERSION alfresco-js-api total build to ~${1} in ${DESTDIR}======"
    DESTDIR="$DIR/../lib/"
    PACKAGETOCHANGE="alfresco-js-api"

    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \".*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~.*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"^.*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
}

update_dependency_version(){

   for (( k=0; k<${projectslength}; k++ ));
   do
    echo "====== UPDATE  ${projects[$k]} version ${VERSION} ======"
    DESTDIR="$DIR/.."

       sed "${sedi[@]}" "s/\"${prefix}${projects[$k]}\": \".*\"/\"${prefix}${projects[$k]}\": \"${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${prefix}${projects[$k]}\": \"~.*\"/\"${prefix}${projects[$k]}\": \"~${VERSION}\"/g"  ${DESTDIR}/package.json
       sed "${sedi[@]}" "s/\"${prefix}${projects[$k]}\": \"^.*\"/\"${prefix}${projects[$k]}\": \"^${VERSION}\"/g"  ${DESTDIR}/package.json
   done
}

update_js_version(){
    echo "====== UPDATE VERSION alfresco-js-api version ${1} ======"
    DESTDIR="$DIR/../"
    PACKAGETOCHANGE="alfresco-js-api"

    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \".*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"~.*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
    sed "${sedi[@]}" "s/\"${PACKAGETOCHANGE}\": \"^.*\"/\"${PACKAGETOCHANGE}\": \"${1}\"/g"  ${DESTDIR}/package.json
}

clean_lock(){
   echo "====== clean lock file  ======"
    DESTDIR="$DIR/.."
    rm ${DESTDIR}/package-lock.json
}

while [[ $1  == -* ]]; do
    case "$1" in
      -h|--help|-\?) show_help; exit 0;;
      -v|version) version_change $2; shift 2;;
      -sj|sjsapi) skip_js; shift;;
      -vj|versionjsapi)  version_js_change $2; shift 2;;
      -gnu) gnu_mode; shift;;
      -alpha) last_alpha_mode; shift;;
      -nextalpha) next_alpha_mode; shift;;
      -beta) last_beta_mode; shift;;
      -nextbeta) next_beta_mode; shift;;
      -demoshell) only_demoshell; shift;;
      -*) shift;;
    esac
done

if $GNU; then
 sedi='-i'
else
 sedi=('-i' '')
fi

if [[ "${VERSION}" == "" ]]
then
  echo "Version number required"
  exit 1
fi

cd "$DIR/../"

projectslength=${#projects[@]}

if $EXEC_COMPONENT == true; then
    echo "====== UPDATE COMPONENTS ======"

    # use for loop to read all values and indexes
    for (( i=0; i<${projectslength}; i++ ));
    do
       echo "====== UPDATE COMPONENT ${projects[$i]} ======"
       update_component_version ${projects[$i]}
       update_component_dependency_version ${projects[$i]}

    done
fi

echo "====== UPDATE DEMO SHELL ======"

DESTDIR="$DIR/../demo-shell/"
sed "${sedi[@]}" "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../demo-shell/package.json


echo "====== UPDATE GLOBAL======"

clean_lock

update_dependency_version

if $JS_API == true; then
    if $DIFFERENT_JS_API == true; then
        update_js_version ${VERSION_JS_API}
    else
        update_js_version ${VERSION}
    fi
fi

DESTDIR="$DIR/../demo-shell/"
sed "${sedi[@]}" "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../demo-shell/package.json

if $EXEC_COMPONENT == true; then
    sed "${sedi[@]}" "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/g"  ${DIR}/../lib/package.json
fi
