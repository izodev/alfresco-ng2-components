#!/bin/bash

base_url="$1"

test -z "$base_url" && base_url="http://adfdev.envalfresco.com"

bpm_url="$base_url/activiti-app"

bpm_user="$2"
test -z "$bpm_user" && bpm_user="admin@app.activiti.com"

bpm_pass="$3"
test -z "$bpm_pass" && bpm_pass="admin"

bpm_user1_email="dev@app.activiti.com"
bpm_user2_email="mike_rotch@app.activiti.com"
bpm_user3_email="mike_hunt@app.activiti.com"
bpm_user4_email="ivana_tinkle@app.activiti.com"
bpm_user5_email="anita_bath@app.activiti.com"
bpm_user6_email="qa@app.activiti.com"
bpm_user7_email="jenni_joy@activiti.com"

bpm_user_password="adfUser"

COMMAND="curl -s -o /dev/null -I -w %{http_code} $bpm_url/#/login"
while HTTPCODE=$($COMMAND); [[ $HTTPCODE != 200 ]]; # if the curl command IS NOT 200
do
  echo "Waiting for activiti to be ready @ $bpm_url ..."
  sleep 2
done

agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:51.0) Gecko/20100101 Firefox/51.0'
csrf_token="9e3617ef39948664587f7aaaf0003ccadc"

function extract_id_from_json() {
  [[ "$1" =~ ^\{\"id\":\"?([^\",]+)\"? ]] && echo "${BASH_REMATCH[1]}" || echo ""
}

function extract_remeber_me_cookie() {
   [[ "$1" =~ ACTIVITI_REMEMBER_ME=[A-Za-z0-9]+\; ]] && echo "Hello, ${BASH_REMATCH[0]}" || echo ""
}

function log_in {
  userName="$1"
  password="$2"
  local resp=$( curl -s -D - \
    -X POST \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    -d "j_username=$userName&j_password=$password&_spring_security_remember_me=true&submit=Login" \
    "$bpm_url/app/authentication" )
   echo $( extract_remeber_me_cookie "$resp" )
}

function get_share_app_req() {
  echo "{\"added\":[
          {\"userId\":$1,\"permission\":\"read\"},
          {\"userId\":$2,\"permission\":\"read\"},
          {\"userId\":$3,\"permission\":\"read\"},
          {\"userId\":$4,\"permission\":\"read\"},
          {\"userId\":$5,\"permission\":\"read\"},
          {\"userId\":$6,\"permission\":\"read\"}
        ],\"updated\":[],\"removed\":[]}"
}

function share_app() {
  appId="$1"
  remeber_me="$2"
  req=$( get_share_app_req $3 $4 $5 $6 $7 $8)
  local resp=$( curl --write-out %{http_code} --silent --output /dev/null \
    -X PUT \
    -A "$agent" \
    -H "Cookie: $remeber_me CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    -d "$req" \
    "$bpm_url/app/rest/models/$appId/share-info" )
  echo "$resp"
}

function bpm_create_tenant() {
  tenant_name="$1"
  local resp=$( curl --write-out %{http_code} -s \
    -X POST \
    -u "$bpm_user:$bpm_pass" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    -d '{"active":true,"maxUsers":10,"name":"'$tenant_name'"}' \
    "$bpm_url/api/enterprise/admin/tenants")
  echo $( extract_id_from_json "$resp" )
}

function bpm_create_user_multi_tenant() {
  tenant_id="$5"
  local resp=$( curl -s \
    -u "$bpm_user:$bpm_pass" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    -d '{"firstName":"'$1'", "lastName":"'$2'", "email":"'$3'", "password":"'$4'", "status":"active", "type":"enterprise", "tenantId":"'$tenant_id'"}' \
    "$bpm_url/api/enterprise/admin/users" )
  echo $( extract_id_from_json "$resp" )
}

function bpm_create_user_single_tenant() {
  tenant_id="$5"
  test -z "$5" && tenant_id=1
  local resp=$( curl -s \
    -u "$bpm_user:$bpm_pass" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    -d '{"firstName":"'$1'", "lastName":"'$2'", "email":"'$3'", "password":"'$4'", "status":"active", "type":"enterprise", "tenantId":'$tenant_id'}' \
    "$bpm_url/api/enterprise/admin/users" )
  echo $( extract_id_from_json "$resp" )
}

function bpm_import_app() {
  local resp=$( curl -s \
    -u "$bpm_user1_email:$bpm_user_password" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -F file=@$1 \
    "$bpm_url/api/enterprise/app-definitions/import?renewIdmEntries=true" )
  echo $( extract_id_from_json "$resp" )
}

function bpm_publish_app() {
  curl \
    -u "$bpm_user1_email:$bpm_user_password" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    -d "{ \"comment\": \"\", \"force\": false }" \
    "$bpm_url/api/enterprise/app-definitions/$1/publish"
}

function bpm_deploy_app() {
  curl \
    -u "$bpm_user1_email:$bpm_user_password" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    -d "{ \"appDefinitions\": [{\"id\":$1}] }" \
    "$bpm_url/api/enterprise/runtime-app-definitions"
}

function bpm_create_model() {
  local resp=$( curl \
    -u "$bpm_user1_email:$bpm_user_password" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    -d "{\"modelType\": $1, \"name\": \"$2\", \"description\": \"$3\" }" \
    "$bpm_url/api/enterprise/models" )
  echo "$resp" >&2
  echo $( extract_id_from_json "$resp" )
}

function bpm_save_form() {
  curl \
    -X 'PUT' \
    -u "$bpm_user1_email:$bpm_user_password" \
    -A "$agent" \
    -H "Cookie: CSRF-TOKEN=$csrf_token" \
    -H "X-CSRF-TOKEN: $csrf_token" \
    -H 'Content-Type: application/json' \
    --data-binary "@$2" \
    "$bpm_url/api/enterprise/editor/form-models/$1"
}

function create_process() {
    local resp=$( curl \
      -X POST \
      -u "$bpm_user1_email:$bpm_user_password" \
      -A "$agent" \
      -H "Cookie: CSRF-TOKEN=$csrf_token" \
      -H "X-CSRF-TOKEN: $csrf_token" \
      -H "Content-Type: application/json" \
      -d '{"values":{"clientname":"Steve","policyno":"1111","billamount":"10500","billdate":"2017-05-29T00:00:00.000Z","claimtype":{"id":"reimbursement","name":"Reimbursement"},"hospitalname":"Aaa"},"processDefinitionId":"ClaimReviewProcess:'$1'","name":"Claim Review Process - June 21st 2017"}' \
      "$bpm_url/api/enterprise/process-instances")
    echo $( extract_id_from_json "$resp" )

    local resps=$( curl \
      -X POST \
      -u "$bpm_user:$bpm_pass" \
      -A "$agent" \
      -H "Cookie: CSRF-TOKEN=$csrf_token" \
      -H "X-CSRF-TOKEN: $csrf_token" \
      -H "Content-Type: application/json" \
      -d '{"values":{"clientname":"Jhon","policyno":"5553","billamount":"20050","billdate":"2017-02-29T00:00:00.000Z","claimtype":{"id":"reimbursement","name":"Cashless"},"hospitalname":"abc"},"processDefinitionId":"ClaimReviewProcess:'$1'","name":"Claim Review Process - May 21st 2017"}' \
      "$bpm_url/api/enterprise/process-instances")
    echo $( extract_id_from_json "$resps" )
}

function get_process_definition_id {
    local resp=$( curl \
      -X GET \
      -u "$bpm_user1_email:$bpm_user_password" \
      -A "$agent" \
      -H "Cookie: CSRF-TOKEN=$csrf_token" \
      -H "X-CSRF-TOKEN: $csrf_token" \
      -H "Content-Type: application/json" \
      "$bpm_url/api/enterprise/process-definitions")
    definition_Id=$( echo $resp | sed -e 's/^.*"ClaimReviewProcess:\([^"]*\)".*$/\1/' )
    echo $definition_Id
}

function assign_to_user() {
  app_id="$1"
  echo "$app_id"
}

remember_me=$( log_in $bpm_user $bpm_pass)
test -z "$remember_me" && echo "Dev Environment:- Error while logging into the environment" && exit 1

: <<'comment_one'
tenantId=$( bpm_create_tenant "bonjour" )
test -z "$tenantId" && echo "Dev Environment:- created a tenant $tenantId" && exit 1
echo "Dev Environment:- created a tenant $tenantId"

id1=$(bpm_create_user_multi_tenant "dev" "user" $bpm_user1_email $bpm_user_password $tenantId)
test -z "$id1" && echo "Dev Environment:- Either Could not find user id or User already registered $id7" && exit 1
id2=$(bpm_create_user_multi_tenant "Mike" "Rotch" $bpm_user2_email $bpm_user_password $tenantId)
test -z "$id2" && echo "Dev Environment:- Either Could not find user id or User already registered $id2" && exit 1
id3=$(bpm_create_user_multi_tenant "Mike" "Hunt" $bpm_user3_email $bpm_user_password $tenantId)
test -z "$id3" && echo "Dev Environment:- Either Could not find user id or User already registered $id3" && exit 1
id4=$(bpm_create_user_multi_tenant "Ivana" "Tinkle" $bpm_user4_email $bpm_user_password $tenantId)
test -z "$id4" && echo "Dev Environment:- Either Could not find user id or User already registered $id4" && exit 1
id5=$(bpm_create_user_multi_tenant "Anita" "Bath" $bpm_user5_email $bpm_user_password $tenantId)
test -z "$id5" && echo "Dev Environment Either Could not find user id or User already registered $id5" && exit 1
id6=$(bpm_create_user_multi_tenant "qa" "user" $bpm_user6_email $bpm_user_password $tenantId)
test -z "$id6" && echo "Dev Environment:- Either Could not find user id or User already registered $id6" && exit 1
id7=$(bpm_create_user_multi_tenant "Jenni" "joy" $bpm_user7_email $bpm_user_password $tenantId)
test -z "$id7" && echo "Dev Environment:- Either Could not find user id or User already registered $id1" && exit 1
comment_one

#remeber_me2=$( log_in "qa@app.activiti.com" "adfUser")
#test -z "$remeber_me2" && echo "Dev Environment:- Error while logging into the environment" && exit 1


for f in apps/*.zip
do
	echo "> App Found: - $f"
        app_id=$( bpm_import_app "$f" )
        test -z "$app_id" && echo "Could not find app ID" && exit 1
        bpm_publish_app "$app_id"
        bpm_deploy_app "$app_id"
        assign_to_user "$app_id"
        echo "> App $f Published and Deployed."

        share_resp=$( share_app $app_id $remember_me $id1 $id2 $id3 $id4 $id5 $id6 $id7)
        #test "$share_resp" != "200" && echo "Error while sharing app with the users" && exit 1
done

: <<'comment_two'
echo "> Dev Environment:- Users created with these ids ( $id1, $id2, $id3, $id4, $id5, $id6 $id7 )."

process_def_id=$(get_process_definition_id)
test -z "$process_def_id" && echo "Could not find process definition ID" && exit 1
process_instance_ids=$(create_process "$process_def_id")
test -z "$process_instance_ids" && echo "Could not find process instance ID" && exit 1
echo "> Initiated two process instances with ids ( $process_instance_ids )"
comment_two