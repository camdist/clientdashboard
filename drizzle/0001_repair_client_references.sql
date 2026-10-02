-- The payload holds the owner selected in the application. Align the indexed
-- column for existing valid records so relationship checks see the same owner.
UPDATE records SET client=json_extract(payload,'$.client')
WHERE kind IN ('client','project','task','invoice','content','resource','social-account')
AND json_valid(payload)
AND json_extract(payload,'$.id')=id
AND json_extract(payload,'$.kind')=kind
AND typeof(json_extract(payload,'$.client'))='text'
AND client<>json_extract(payload,'$.client');
