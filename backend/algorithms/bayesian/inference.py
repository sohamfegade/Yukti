from schemas.bayesian import InferenceRequest, InferenceResponse, BayesianNetwork, BayesianNode, BayesianEdge

class BayesianEngine:
    @staticmethod
    def infer(req: InferenceRequest) -> InferenceResponse:
        p_d = req.prior
        p_not_d = 1.0 - p_d
        
        # P(E|D) and P(E|~D)
        p_e_given_d = req.true_positive_rate
        p_e_given_not_d = req.false_positive_rate
        
        # Depending on whether evidence is observed or not
        if req.evidence_observed:
            likelihood = p_e_given_d
            likelihood_not_d = p_e_given_not_d
            evidence_label = "E"
        else:
            likelihood = 1.0 - p_e_given_d
            likelihood_not_d = 1.0 - p_e_given_not_d
            evidence_label = "~E"
            
        # Law of total probability: P(E) = P(E|D)P(D) + P(E|~D)P(~D)
        marginal_evidence = (likelihood * p_d) + (likelihood_not_d * p_not_d)
        
        # Bayes Theorem: P(D|E) = P(E|D)P(D) / P(E)
        if marginal_evidence > 0:
            posterior = (likelihood * p_d) / marginal_evidence
        else:
            posterior = 0.0
            
        # Construct Network Graph for UI
        nodes = [
            BayesianNode(id="prior", label="Prior P(D)", probability=p_d),
            BayesianNode(id="evidence", label=f"Evidence P({evidence_label})", probability=marginal_evidence),
            BayesianNode(id="posterior", label=f"Posterior P(D|{evidence_label})", probability=posterior)
        ]
        
        edges = [
            BayesianEdge(source="prior", target="posterior", label="Bayesian Update"),
            BayesianEdge(source="evidence", target="posterior", label="Normalization")
        ]
        
        network = BayesianNetwork(nodes=nodes, edges=edges)
        
        steps = [
            f"1. Identify Prior: P(D) = {p_d:.4f}",
            f"2. Identify Likelihood: P({evidence_label}|D) = {likelihood:.4f}",
            f"3. Calculate Marginal Evidence: P({evidence_label}) = {marginal_evidence:.4f}",
            f"4. Apply Bayes' Theorem: P(D|{evidence_label}) = (P({evidence_label}|D) * P(D)) / P({evidence_label})",
            f"   = ({likelihood:.4f} * {p_d:.4f}) / {marginal_evidence:.4f} = {posterior:.4f}"
        ]
        
        return InferenceResponse(
            prior=p_d,
            likelihood=likelihood,
            marginal_evidence=marginal_evidence,
            posterior=posterior,
            network=network,
            calculation_steps=steps
        )
