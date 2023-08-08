FROM openpolicyagent/opa:latest

COPY policy.rego /policies/policy.rego

CMD ["run", "--server", "--watch", "/policies/policy.rego"]
