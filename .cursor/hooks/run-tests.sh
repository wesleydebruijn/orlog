#!/bin/bash
# Guardrail: when the agent finishes, run the test suite. If it fails, hand the
# output back to the agent as a follow-up so it keeps working until tests pass.
# Bounded by `loop_limit` in .cursor/hooks.json.

input=$(cat)
status=$(echo "$input" | jq -r '.status // empty')

# Only check after a normal completion, not aborted/errored runs.
[ "$status" = "completed" ] || exit 0

command -v mix >/dev/null 2>&1 || exit 0

output=$(mix test 2>&1)
if [ $? -eq 0 ]; then
  exit 0
fi

# Keep the follow-up small: the tail holds the failures and summary.
tail=$(echo "$output" | tail -n 60)
jq -n --arg out "$tail" '{
  followup_message: ("`mix test` failed. Fix the failures (do not delete or skip tests to make them pass), then re-run `mix test`.\n\n" + $out)
}'
