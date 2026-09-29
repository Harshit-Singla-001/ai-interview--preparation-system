import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to create questions
function createQ(id, topic, difficulty, question, options, correctAnswer, explanation) {
  return { id, topic, difficulty, question, options, correctAnswer, explanation };
}

// -------------------------------------------------------------
// 1. ROLE_DATA_SCIENTIST (30 Questions)
// -------------------------------------------------------------
const dataScientistQuestions = [
  createQ(1, "Machine Learning", "Medium", "Which evaluation metric is MOST resilient to severe class imbalance in binary classification?", {
    A: "Overall Classification Accuracy",
    B: "Area Under the Precision-Recall Curve (PR-AUC)",
    C: "Mean Squared Error (MSE)",
    D: "Root Mean Squared Logarithmic Error (RMSLE)"
  }, "B", "PR-AUC focuses directly on minority positive class performance and precision/recall trade-off."),

  createQ(2, "Statistics", "Medium", "In hypothesis testing, what does a p-value strictly measure?", {
    A: "The probability that the null hypothesis is true",
    B: "The probability of observing data as extreme as observed, assuming the null hypothesis is true",
    C: "The probability that the alternative hypothesis is false",
    D: "The practical effect size of the experiment"
  }, "B", "A p-value measures P(Data >= observed | H0 is true). It is never the posterior probability of H0."),

  createQ(3, "Data Wrangling", "Easy", "What is the primary difference between Pandas .loc[] and .iloc[]?", {
    A: ".loc is for columns only; .iloc is for rows only",
    B: ".loc uses label-based indexing, whereas .iloc uses integer position-based indexing",
    C: ".loc modifies data in-place; .iloc returns a deep copy",
    D: ".loc works only on Series; .iloc works exclusively on DataFrames"
  }, "B", ".loc matches explicit index labels and column names, while .iloc strictly indexes by integer offsets."),

  createQ(4, "Machine Learning", "Hard", "How does L1 regularization (Lasso) differ fundamentally from L2 regularization (Ridge)?", {
    A: "L1 penalizes sum of squared weights, whereas L2 penalizes sum of absolute weights",
    B: "L1 encourages sparsity by driving redundant feature coefficients strictly to zero, whereas L2 shrinks coefficients toward zero without zeroing them",
    C: "L1 is computationally non-convex, whereas L2 is always convex",
    D: "L1 is only applicable to decision trees, whereas L2 is for neural nets"
  }, "B", "Lasso adds the L1 norm sum(|w|) whose diamond constraint boundary sets uninformative weights to exactly 0."),

  createQ(5, "SQL", "Medium", "Which SQL clause is used to filter records AFTER group aggregations have been calculated?", {
    A: "WHERE",
    B: "ORDER BY",
    C: "HAVING",
    D: "PARTITION BY"
  }, "C", "The WHERE clause filters rows prior to aggregation; HAVING filters grouped rows after aggregation functions."),

  createQ(6, "Machine Learning", "Easy", "What is the primary trade-off described by the Bias-Variance tradeoff?", {
    A: "Model training speed vs. inference speed",
    B: "Underfitting (high bias) vs. Overfitting (high variance)",
    C: "Precision vs. Recall in clustering",
    D: "CPU memory vs. GPU core utilization"
  }, "B", "High bias causes underfitting due to oversimplified assumptions; high variance causes overfitting to training noise."),

  createQ(7, "Statistics", "Easy", "What does the Central Limit Theorem state regarding the sample mean?", {
    A: "Any population distribution becomes normal as sample size grows",
    B: "The sampling distribution of the sample mean approaches a normal distribution as sample size n increases, regardless of population shape",
    C: "The sample median is always equal to the population mode",
    D: "Sample variance is always equal to population standard deviation"
  }, "B", "For sufficiently large sample sizes (n >= 30), the sampling distribution of the mean is approximately normal."),

  createQ(8, "Machine Learning", "Medium", "In Random Forest classifiers, what does 'Bagging' stand for?", {
    A: "Boosted Aggregate Gradient",
    B: "Bootstrap Aggregating",
    C: "Bayesian Adaptive Grouping",
    D: "Boundary Allocation Graphing"
  }, "B", "Bootstrap Aggregating trains multiple decision trees on random resampled subsets with replacement."),

  createQ(9, "Statistics", "Hard", "What type of error is committed when a researcher fails to reject a false null hypothesis?", {
    A: "Type I Error (False Positive)",
    B: "Type II Error (False Negative)",
    C: "Standard Error of the Mean",
    D: "Degrees of Freedom Error"
  }, "B", "Type II error (beta) occurs when the null hypothesis is false, but the test fails to detect the effect."),

  createQ(10, "Data Wrangling", "Medium", "Which imputation method is best suited for numeric features with extreme outliers?", {
    A: "Mean imputation",
    B: "Median or KNN imputation",
    C: "Zero fill imputation",
    D: "Standard deviation scaling"
  }, "B", "The median is robust against extreme skewed outliers, whereas the mean is distorted by extreme values."),

  createQ(11, "Machine Learning", "Medium", "What problem does K-Fold Cross Validation primarily solve?", {
    A: "Slow gradient descent convergence",
    B: "Optimistic evaluation bias and dataset split sensitivity",
    C: "High multicollinearity in linear models",
    D: "Feature dimensionality reduction"
  }, "B", "K-Fold evaluates the model across K independent test folds to provide an unbiased estimate of generalization."),

  createQ(12, "Machine Learning", "Hard", "In Support Vector Machines, what is the purpose of the 'Kernel Trick'?", {
    A: "To compress large training data into RAM",
    B: "To compute dot products in high-dimensional feature space without explicitly transforming the coordinates",
    C: "To replace convex quadratic programming with gradient descent",
    D: "To perform unsupervised dimensionality reduction"
  }, "B", "The kernel trick computes inner products in higher-dimensional Hilbert space directly using kernel functions."),

  createQ(13, "Data Wrangling", "Easy", "Which Pandas function is used to convert categorical variables into dummy/indicator 0/1 columns?", {
    A: "pd.factorize()",
    B: "pd.get_dummies()",
    C: "df.pivot()",
    D: "df.melt()"
  }, "B", "pd.get_dummies() creates one-hot encoded binary indicator columns for categorical values."),

  createQ(14, "Statistics", "Medium", "What does Pearson correlation coefficient (r = 0) strictly indicate?", {
    A: "There is absolutely no relationship between the two variables",
    B: "There is no linear relationship between the two variables",
    C: "The two variables are statistically independent",
    D: "Both variables follow uniform distributions"
  }, "B", "Pearson correlation only detects linear associations. Non-linear relationships (like y = x^2) can have r = 0."),

  createQ(15, "Machine Learning", "Medium", "What is the ROC curve plotting across varying classification thresholds?", {
    A: "Precision against Recall",
    B: "True Positive Rate (Sensitivity) against False Positive Rate (1 - Specificity)",
    C: "Training loss against Validation loss",
    D: "Accuracy against F1-score"
  }, "B", "The ROC curve plots TPR vs FPR across all possible discrimination thresholds."),

  createQ(16, "Machine Learning", "Easy", "Which algorithm is an unsupervised clustering technique that assigns data points to K centroids?", {
    A: "K-Nearest Neighbors (KNN)",
    B: "K-Means Clustering",
    C: "Linear Discriminant Analysis",
    D: "Naïve Bayes"
  }, "B", "K-Means is an unsupervised clustering algorithm; KNN is a supervised classification/regression algorithm."),

  createQ(17, "Statistics", "Hard", "When multiple predictor features in linear regression are highly correlated with each other, what is this called?", {
    A: "Heteroscedasticity",
    B: "Multicollinearity",
    C: "Autocorrelation",
    D: "Endogeneity"
  }, "B", "Multicollinearity inflates standard errors of regression coefficients, making estimates unstable."),

  createQ(18, "Machine Learning", "Hard", "In Gradient Boosting Machines (XGBoost/LightGBM), each sequential tree is trained to predict what?", {
    A: "The original target variable directly",
    B: "The pseudo-residuals (negative gradient of the loss function) of previous trees",
    C: "The random noise distribution",
    D: "The class probability threshold"
  }, "B", "Boosting fits subsequent learners to the residual errors of the current ensemble."),

  createQ(19, "Data Wrangling", "Medium", "What does standard scaling (Z-score normalization) do to a continuous feature?", {
    A: "Scales values strictly between [0, 1]",
    B: "Transforms the feature to have mean = 0 and standard deviation = 1",
    C: "Removes all negative values",
    D: "Converts the distribution to a uniform distribution"
  }, "B", "Z-score normalization computes (x - mean) / std, centering the mean at 0 and variance at 1."),

  createQ(20, "Machine Learning", "Easy", "In decision tree algorithms, what is Information Gain based on?", {
    A: "Root Mean Squared Error",
    B: "Reduction in Entropy",
    C: "Silhouette Coefficient",
    D: "L2 Loss reduction"
  }, "B", "Information Gain measures the expected reduction in Shannon Entropy after splitting on an attribute."),

  createQ(21, "Statistics", "Medium", "What does Bayes' Theorem describe?", {
    A: "The sampling distribution of the median",
    B: "The conditional probability of an event given prior knowledge of conditions related to the event",
    C: "The linear combination of eigenvectors",
    D: "The convergence rate of gradient descent"
  }, "B", "Bayes' Theorem relates P(A|B) = [P(B|A) * P(A)] / P(B)."),

  createQ(22, "Machine Learning", "Medium", "Why do we evaluate models on a separate test set rather than the training set?", {
    A: "To verify runtime execution speed",
    B: "To measure out-of-sample generalization and avoid overfitting optimism",
    C: "To reduce feature dimensions",
    D: "To normalize target predictions"
  }, "B", "Evaluating on unseen test data detects whether the model has memorized noise or learned generalizable patterns."),

  createQ(23, "SQL", "Hard", "Which SQL window function assigns a rank to each row with no gaps in ranking values?", {
    A: "RANK()",
    B: "DENSE_RANK()",
    C: "ROW_NUMBER()",
    D: "NTILE()"
  }, "B", "DENSE_RANK() leaves no gaps between ranked tiers when ties occur (e.g., 1, 2, 2, 3), whereas RANK() skips (1, 2, 2, 4)."),

  createQ(24, "Machine Learning", "Hard", "What does Principal Component Analysis (PCA) maximize when finding the first principal component?", {
    A: "Classification accuracy of target labels",
    B: "The variance of projected data points along the component vector",
    C: "The entropy of features",
    D: "The sparsity of feature coefficients"
  }, "B", "PCA identifies orthogonal axes that capture the maximum variance of the feature space."),

  createQ(25, "Statistics", "Easy", "What is the median of the following dataset: [3, 7, 8, 12, 14, 18, 20]?", {
    A: "8",
    B: "12",
    C: "14",
    D: "11.7"
  }, "B", "In an ordered dataset of 7 values, the middle value (4th position) is 12."),

  createQ(26, "Machine Learning", "Medium", "What is the key assumption of Naïve Bayes classifiers?", {
    A: "Features follow a uniform distribution",
    B: "All input features are conditionally independent given the class label",
    C: "Features are linearly separable",
    D: "Features have equal variance and zero covariance"
  }, "B", "Naïve Bayes makes the strong assumption that all predictors are mutually independent given class outcome."),

  createQ(27, "Data Wrangling", "Medium", "In Pandas, which operation combines two DataFrames horizontally based on shared key columns?", {
    A: "pd.concat(axis=0)",
    B: "pd.merge()",
    C: "df.append()",
    D: "df.stack()"
  }, "B", "pd.merge() performs relational database-style joins (inner, outer, left, right) on matching key columns."),

  createQ(28, "Machine Learning", "Hard", "What happens when the regularization parameter C in a Logistic Regression model is set extremely high?", {
    A: "Regularization penalty increases to maximum, causing severe underfitting",
    B: "Regularization penalty decreases toward zero, increasing risk of overfitting",
    C: "The model turns into an unsupervised clustering algorithm",
    D: "Features are forced to have unit variance"
  }, "B", "In scikit-learn, C is inverse regularization strength (1/lambda). Large C means minimal regularization."),

  createQ(29, "Statistics", "Medium", "If a distribution has a long tail extending toward the right, what is its skewness?", {
    A: "Negative skew (left-skewed)",
    B: "Positive skew (right-skewed)",
    C: "Zero skew (symmetric)",
    D: "Bimodal skew"
  }, "B", "A distribution with a long right tail has positive skewness, and the mean is typically greater than the median."),

  createQ(30, "Machine Learning", "Medium", "Which algorithm creates an ensemble of weak decision trees sequentially where each tree corrects the errors of its predecessor?", {
    A: "Random Forest",
    B: "Gradient Boosted Decision Trees (GBDT)",
    C: "Linear Discriminant Analysis",
    D: "K-Means Clustering"
  }, "B", "GBDT sequentially builds shallow trees to minimize the loss function gradient of prior predictions.")
];

// -------------------------------------------------------------
// 2. ROLE_AI_ENGINEER (30 Questions)
// -------------------------------------------------------------
const aiEngineerQuestions = [
  createQ(1, "Deep Learning", "Medium", "Why is ReLU activation generally preferred over Sigmoid in hidden layers of deep networks?", {
    A: "ReLU outputs values bounded strictly between -1 and 1",
    B: "ReLU mitigates the vanishing gradient problem for positive activations and is computationally efficient",
    C: "ReLU has a continuous derivative across the entire real number line",
    D: "ReLU eliminates the need for batch normalization"
  }, "B", "Sigmoid saturates at 0 and 1, extinguishing gradients. ReLU maintains a gradient of 1 for x > 0."),

  createQ(2, "Computer Vision", "Medium", "What is the primary function of a Convolutional Layer in a CNN?", {
    A: "To compute fully connected matrix multiplications",
    B: "To extract local spatial feature hierarchies (edges, textures, shapes) through learnable filters",
    C: "To downsample the input sequence temporally",
    D: "To normalize activation variances across mini-batches"
  }, "B", "Conv layers slide parameterized kernels across input tensors to detect spatial patterns with parameter sharing."),

  createQ(3, "NLP & Transformers", "Hard", "What is the time and memory complexity of standard multi-head self-attention with sequence length N?", {
    A: "O(N) linear complexity",
    B: "O(N^2) quadratic complexity",
    C: "O(N log N) log-linear complexity",
    D: "O(2^N) exponential complexity"
  }, "B", "Computing pairwise dot products between all N queries and N keys yields an N x N attention matrix (O(N^2))."),

  createQ(4, "Deep Learning", "Medium", "What does the technique 'Dropout' do during neural network training?", {
    A: "Permanently deletes weights that are smaller than a threshold",
    B: "Randomly zeroes out a fraction of neuron activations on each forward pass to prevent co-adaptation",
    C: "Reduces the learning rate by a constant factor",
    D: "Eliminates low-confidence output classes"
  }, "B", "Dropout forces neurons to learn robust independent features by randomly dropping activations during training."),

  createQ(5, "Optimization", "Medium", "How does Adam optimizer differ fundamentally from standard Stochastic Gradient Descent (SGD)?", {
    A: "Adam does not compute gradients of the loss function",
    B: "Adam computes adaptive individual learning rates for each parameter using first and second moments of gradients",
    C: "Adam works only on convex quadratic surfaces",
    D: "Adam executes strictly on CPU without tensor math"
  }, "B", "Adam combines momentum (first moment estimate) with RMSprop (second uncentered moment estimate)."),

  createQ(6, "Deep Learning", "Easy", "What is an epoch in deep learning training?", {
    A: "The time taken to execute one gradient descent step on a mini-batch",
    B: "One complete pass through the entire training dataset",
    C: "The total number of layers in a convolutional network",
    D: "The learning rate decay schedule"
  }, "B", "An epoch is completed when every sample in the training set has been passed through the network once."),

  createQ(7, "NLP & Transformers", "Medium", "In the Transformer architecture, what is the role of Positional Encodings?", {
    A: "To normalize word embedding vector magnitudes",
    B: "To inject information about token order/sequence position since self-attention is permutation-invariant",
    C: "To prevent vanishing gradients in deep feedforward layers",
    D: "To perform named entity recognition"
  }, "B", "Self-attention operations do not inherently encode token order; positional encodings provide sequence positioning."),

  createQ(8, "Computer Vision", "Medium", "What does Max Pooling achieve in a CNN?", {
    A: "Expands the spatial resolution of feature maps",
    B: "Downsamples spatial dimensions, reducing parameter count and providing translation invariance",
    C: "Computes pixel-wise softmax probabilities",
    D: "Inverts image color channels"
  }, "B", "Max pooling retains the maximum activation in local patches, reducing tensor dimensions."),

  createQ(9, "MLOps & Deployment", "Hard", "What is model quantization in LLM and edge deployment?", {
    A: "Pruning half of the attention heads randomly",
    B: "Converting high-precision weights (e.g., FP32/FP16) to lower-precision integers (e.g., INT8/INT4) to reduce memory and accelerate inference",
    C: "Distributing weights across multiple GPUs",
    D: "Adding noise to weights to improve robustness"
  }, "B", "Quantization reduces model memory footprint and arithmetic latency by representing weights with fewer bits."),

  createQ(10, "Generative AI", "Hard", "In Retrieval-Augmented Generation (RAG), how is external factual knowledge integrated into the LLM?", {
    A: "By fine-tuning all model weights on external documents each night",
    B: "By retrieving relevant text chunks using vector embedding similarity search and appending them to the prompt context",
    C: "By modifying the model vocabulary tokenizer",
    D: "By adjusting the model's temperature parameter to zero"
  }, "B", "RAG queries a vector database for semantic context and inserts the retrieved passages into the inference prompt."),

  createQ(11, "Deep Learning", "Hard", "What problem does Batch Normalization primarily address?", {
    A: "Vanishing gradient in output softmax layer",
    B: "Internal covariate shift by normalizing layer inputs across the mini-batch to zero mean and unit variance",
    C: "Memory fragmentation in GPU VRAM",
    D: "Data leakage across cross-validation folds"
  }, "B", "Batch norm stabilizes layer activation distributions across training batches, permitting higher learning rates."),

  createQ(12, "Deep Learning", "Easy", "Which loss function is standard for multi-class classification where target labels are mutually exclusive?", {
    A: "Binary Cross-Entropy (Log Loss)",
    B: "Categorical Cross-Entropy Loss",
    C: "Mean Absolute Error (L1)",
    D: "Contrastive Loss"
  }, "B", "Categorical cross-entropy paired with a softmax activation evaluates multi-class categorical probabilities."),

  createQ(13, "Computer Vision", "Medium", "In Object Detection, what does Intersection over Union (IoU) evaluate?", {
    A: "The speed of frame processing in FPS",
    B: "The overlap between the predicted bounding box and the ground truth bounding box",
    C: "The depth map accuracy in stereo vision",
    D: "The ratio of positive to negative anchor boxes"
  }, "B", "IoU = Area of Overlap / Area of Union, measuring bounding box localization precision."),

  createQ(14, "NLP & Transformers", "Medium", "What does temperature control during LLM text generation sampling?", {
    A: "The GPU clock frequency",
    B: "The sharpness/entropy of the next-token probability distribution (lower = more deterministic, higher = more creative)",
    C: "The maximum token length allowed in the response",
    D: "The size of the vector embedding dimension"
  }, "B", "Dividing logits by temperature scales entropy: T < 1 concentrates probability on top logits; T > 1 flattens it."),

  createQ(15, "Deep Learning", "Medium", "Why do Residual Networks (ResNets) introduce skip/shortcut connections?", {
    A: "To reduce the number of convolution filters by half",
    B: "To allow gradients to flow directly backwards through identity shortcuts, enabling training of very deep networks without vanishing gradients",
    C: "To prevent GPU out-of-memory errors",
    D: "To perform image segmentation without pooling"
  }, "B", "Identity skip connections let gradients propagate directly through the computational graph without degradation."),

  createQ(16, "Generative AI", "Hard", "In diffusion models for image generation, what is the 'reverse process'?", {
    A: "Calculating the negative gradient of an adversarial discriminator",
    B: "Sequentially predicting and removing noise from an initially Gaussian noise tensor to recover a clean image",
    C: "Converting raster images into SVG vector graphics",
    D: "Backpropagating pixel loss into text prompt tokens"
  }, "B", "Diffusion trains a neural net (U-Net) to predict noise step-by-step, transforming pure Gaussian noise into structured images."),

  createQ(17, "Deep Learning", "Easy", "In PyTorch, which method call computes the gradients of a loss tensor with respect to model parameters?", {
    A: "optimizer.step()",
    B: "loss.backward()",
    C: "model.eval()",
    D: "torch.no_grad()"
  }, "B", "loss.backward() executes reverse-mode automatic differentiation, accumulating gradients in .grad attributes."),

  createQ(18, "NLP & Transformers", "Hard", "What is Low-Rank Adaptation (LoRA) used for in LLM fine-tuning?", {
    A: "Pruning low-importance layers from the model",
    B: "Freezing pre-trained model weights and injecting small trainable rank-decomposition matrices into attention layers to drastically reduce fine-tuning memory",
    C: "Converting decoder-only models into encoder-decoder models",
    D: "Quantizing activations to 1-bit integers"
  }, "B", "LoRA decomposes weight updates delta_W into products of low-rank matrices A and B, updating < 1% of total parameters."),

  createQ(19, "MLOps & Deployment", "Medium", "What is the primary difference between online (real-time) inference and batch inference?", {
    A: "Online inference handles single low-latency requests interactively; batch inference processes large volumes offline",
    B: "Online inference uses GPUs only; batch inference uses CPUs only",
    C: "Online inference requires quantization; batch inference does not",
    D: "Online inference updates model weights during execution"
  }, "A", "Online inference requires sub-second response times for live API calls; batch jobs run periodic high-throughput queries."),

  createQ(20, "Computer Vision", "Hard", "In semantic segmentation architectures like U-Net, what is the role of skip connections between encoder and decoder?", {
    A: "To skip training every alternate epoch",
    B: "To transfer fine-grained spatial feature details directly from contracting path to expanding path for precise localization",
    C: "To compute class activation maps",
    D: "To perform global average pooling"
  }, "B", "Skip connections concatenate high-resolution feature maps from encoder to decoder, preserving boundary details."),

  createQ(21, "Deep Learning", "Medium", "What does the learning rate hyperparameter directly control in gradient descent?", {
    A: "The size of the mini-batch",
    B: "The step size taken in the direction of the negative gradient when updating weights",
    C: "The depth of the neural network",
    D: "The weight initialization variance"
  }, "B", "Weight update w = w - lr * grad. Too large learning rates cause divergence; too small causes slow convergence."),

  createQ(22, "NLP & Transformers", "Medium", "What is the primary role of Byte-Pair Encoding (BPE) or WordPiece tokenization?", {
    A: "To translate text between English and French",
    B: "To segment text into subword units, balancing vocabulary size with ability to represent out-of-vocabulary words",
    C: "To compute sentiment polarity scores",
    D: "To remove stop words from inputs"
  }, "B", "Subword tokenizers decompose unknown words into frequent subword components, preventing out-of-vocabulary errors."),

  createQ(23, "Optimization", "Hard", "What is the purpose of Gradient Clipping in recurrent and deep networks?", {
    A: "To speed up data loading from disk",
    B: "To prevent exploding gradients by scaling down gradient vectors when their norm exceeds a specified threshold",
    C: "To eliminate negative gradient values",
    D: "To set gradients of dead neurons to zero"
  }, "B", "Clipping normalizes gradient norm when it exceeds threshold c, preventing explosive weight updates."),

  createQ(24, "Generative AI", "Medium", "What is the function of Vector Embeddings in semantic search?", {
    A: "To compress image files into JPEG format",
    B: "To represent text as continuous dense vectors where semantic similarity correlates with geometric proximity (cosine distance)",
    C: "To encrypt text prompts before transmission",
    D: "To generate synthetic training labels"
  }, "B", "Embeddings map semantic concepts into geometric vector space where related meanings have high cosine similarity."),

  createQ(25, "Deep Learning", "Easy", "Which function maps real-valued logits to a valid probability distribution that sums to 1.0?", {
    A: "Sigmoid",
    B: "Softmax",
    C: "Tanh",
    D: "Leaky ReLU"
  }, "B", "Softmax computes exp(z_i) / sum(exp(z_j)), normalizing logits across all classes into probabilities summing to 1."),

  createQ(26, "Computer Vision", "Medium", "What is Transfer Learning?", {
    A: "Transferring model code from Python to C++",
    B: "Utilizing a pre-trained network trained on a large dataset (e.g., ImageNet) and fine-tuning it on a smaller target dataset",
    C: "Copying weights between GPU and CPU",
    D: "Transferring labels from training to test set"
  }, "B", "Transfer learning leverages generic visual representations learned from large corpuses to solve niche tasks efficiently."),

  createQ(27, "Deep Learning", "Hard", "Why can an overly deep network experience vanishing gradients with Sigmoid or Tanh activations?", {
    A: "The derivatives of Sigmoid are < 0.25, so repeated chain rule multiplications shrink the gradient exponentially toward zero in early layers",
    B: "The loss function becomes non-differentiable at zero",
    C: "Floating point precision cannot represent negative numbers",
    D: "The learning rate becomes infinite"
  }, "A", "Repeatedly multiplying derivatives bounded below 0.25 causes backpropagated gradients to vanish in early layers."),

  createQ(28, "NLP & Transformers", "Medium", "What does Cross-Attention compute in an Encoder-Decoder Transformer?", {
    A: "Attention between decoder queries and encoder key-value representations",
    B: "Attention between input text and random noise",
    C: "Attention between multiple GPUs",
    D: "Attention between layers in the same module"
  }, "A", "Cross-attention allows decoder positions to attend over all positions in the input sequence from the encoder."),

  createQ(29, "MLOps & Deployment", "Medium", "What is ONNX (Open Neural Network Exchange)?", {
    A: "A cloud GPU hardware accelerator",
    B: "An open format built to represent machine learning models, allowing interoperability between frameworks (PyTorch, TensorFlow, TensorRT)",
    C: "A programming language replacing Python",
    D: "A vector database for embeddings"
  }, "B", "ONNX enables models trained in PyTorch or TensorFlow to be exported to standardized runtimes for high-speed inference."),

  createQ(30, "Generative AI", "Hard", "In reinforcement learning from human feedback (RLHF), what role does the Reward Model serve?", {
    A: "It generates token embeddings for the input prompt",
    B: "It evaluates and scores candidate model responses according to human preferences to guide policy optimization (PPO)",
    C: "It monitors GPU temperature",
    D: "It detects copyrighted text"
  }, "B", "The reward model acts as a proxy for human evaluators, scoring responses to train the LLM policy via reinforcement learning.")
];

// -------------------------------------------------------------
// 3. ROLE_BACKEND_DEV (30 Questions)
// -------------------------------------------------------------
const backendDevQuestions = [
  createQ(1, "Node.js Architecture", "Medium", "How does Node.js handle concurrent client connections despite running on a single main thread?", {
    A: "It spawns a new OS thread for each incoming HTTP request",
    B: "It utilizes an asynchronous non-blocking event loop backed by the libuv thread pool for I/O operations",
    C: "It forks the entire process on every socket connection",
    D: "It compiles JavaScript to parallelized C++ bytecode at runtime"
  }, "B", "Node.js runs coordination on a single main thread, delegating asynchronous I/O to libuv worker threads."),

  createQ(2, "API Security", "Medium", "Where should a sensitive JWT session token be stored in browser clients to prevent Cross-Site Scripting (XSS) extraction?", {
    A: "In window.localStorage",
    B: "In an HttpOnly, Secure, SameSite cookie",
    C: "In window.sessionStorage",
    D: "In a global JavaScript variable"
  }, "B", "HttpOnly cookies cannot be read or stolen by client-side JavaScript scripts, protecting against XSS."),

  createQ(3, "System Design", "Hard", "What problem does database indexing solve, and what is its primary trade-off?", {
    A: "Solves data compression; trades off CPU usage",
    B: "Speeds up data retrieval (SELECT); slows down writes (INSERT/UPDATE/DELETE) and consumes additional disk storage",
    C: "Prevents SQL injection; increases query execution time",
    D: "Enforces foreign keys; disables horizontal scaling"
  }, "B", "B-Tree indexes reduce search complexity from O(N) to O(log N), but require extra space and maintenance on writes."),

  createQ(4, "Database Architecture", "Medium", "What does the 'A' in the database ACID acronym stand for?", {
    A: "Asynchronous",
    B: "Atomicity",
    C: "Availability",
    D: "Allocation"
  }, "B", "Atomicity guarantees that all statements in a transaction succeed completely, or all are rolled back with no partial writes."),

  createQ(5, "RESTful APIs", "Easy", "Which HTTP status code signifies that a requested resource was created successfully?", {
    A: "200 OK",
    B: "201 Created",
    C: "204 No Content",
    D: "301 Moved Permanently"
  }, "B", "HTTP 201 Created is returned upon successful creation of a new resource (typically via POST)."),

  createQ(6, "Caching & Redis", "Medium", "What is the 'Cache-Aside' (Lazy Loading) pattern?", {
    A: "Application reads cache first; on miss, reads database and writes data into cache before returning",
    B: "Cache updates the database asynchronously in background batches",
    C: "Database writes to cache automatically on trigger",
    D: "Cache clears every 5 seconds regardless of traffic"
  }, "A", "In Cache-Aside, application logic checks cache first, fetching from DB only upon cache misses."),

  createQ(7, "API Security", "Medium", "What is SQL Injection, and what is the primary defensive mechanism against it?", {
    A: "Injecting CSS into headers; prevented with CORS",
    B: "Malicious SQL code injected into user inputs; prevented by using Parameterized Queries / Prepared Statements",
    C: "Overloading server with connections; prevented with rate limiting",
    D: "Reading files from disk; prevented with chroot"
  }, "B", "Prepared statements separate query structure from user parameters, rendering injected SQL syntax inert."),

  createQ(8, "System Design", "Hard", "According to the CAP Theorem, in the presence of a Network Partition (P), what trade-off must a distributed system make?", {
    A: "Between Performance and Security",
    B: "Between Consistency (C) and Availability (A)",
    C: "Between Throughput and Latency",
    D: "Between Read Speed and Write Speed"
  }, "B", "When network partitions occur, distributed systems must choose either Consistency (CP) or Availability (AP)."),

  createQ(9, "Node.js Architecture", "Hard", "In Node.js, what is the difference between process.nextTick() and setImmediate()?", {
    A: "setImmediate() executes before the current event loop phase finishes; process.nextTick() executes in the next check phase",
    B: "process.nextTick() fires immediately after the current operation before the event loop continues; setImmediate() runs in the next check phase",
    C: "They are completely identical aliases",
    D: "process.nextTick() runs only on worker threads"
  }, "B", "nextTick microtasks drain immediately before the event loop advances to the next phase."),

  createQ(10, "RESTful APIs", "Easy", "Which HTTP method is idempotent and intended for complete replacement of a resource?", {
    A: "POST",
    B: "PUT",
    C: "PATCH",
    D: "DELETE"
  }, "B", "PUT replaces the resource entirely and is idempotent (calling it multiple times produces identical outcome)."),

  createQ(11, "Database Architecture", "Medium", "What is an N+1 Query Problem in Object-Relational Mappers (ORMs)?", {
    A: "A query that returns N+1 columns",
    B: "Executing 1 query to fetch parent records, followed by N separate queries to fetch related child records for each parent",
    C: "Inserting N records in 1 transaction",
    D: "A deadlock between N threads"
  }, "B", "N+1 happens when relationships are lazily loaded in loops; resolved using eager loading (JOINs)."),

  createQ(12, "System Design", "Hard", "What is the purpose of a Reverse Proxy (such as Nginx)?", {
    A: "To compile frontend React assets on client devices",
    B: "To sit between clients and backend servers for load balancing, SSL termination, caching, and security isolation",
    C: "To replicate database shards across continents",
    D: "To execute database migrations automatically"
  }, "B", "A reverse proxy forwards client requests to backend services, handling TLS, load distribution, and compression."),

  createQ(13, "API Security", "Medium", "What does Cross-Origin Resource Sharing (CORS) protect against?", {
    A: "Server memory overflow attacks",
    B: "Unauthorized cross-origin requests initiated by client-side browser scripts to different domains",
    C: "SQL injection attacks",
    D: "Password dictionary attacks"
  }, "B", "CORS is a browser security mechanism that restricts resources requested from a different origin domain."),

  createQ(14, "Caching & Redis", "Medium", "What does a Cache Stampede (Thundering Herd) describe?", {
    A: "When a cache node runs out of physical memory",
    B: "When a popular cached key expires, and thousands of concurrent requests simultaneously hit the database to recompute it",
    C: "When cache eviction deletes keys in FIFO order",
    D: "When network latency exceeds 10 seconds"
  }, "B", "Simultaneous cache misses on a hot key can overwhelm database servers; mitigated with mutex locks or probabilistic early expiry."),

  createQ(15, "RESTful APIs", "Medium", "What is the difference between PUT and PATCH in REST design?", {
    A: "PUT is for creating; PATCH is for deleting",
    B: "PUT replaces the entire resource; PATCH applies partial modifications to specific fields",
    C: "PATCH is idempotent; PUT is not",
    D: "PUT cannot accept JSON bodies"
  }, "B", "PUT provides full replacement of the entity; PATCH updates only the supplied delta of attributes."),

  createQ(16, "Database Architecture", "Hard", "What is Database Sharding?", {
    A: "Backing up tables to cold storage tape drives",
    B: "Horizontally partitioning a database table across multiple independent physical database instances based on a shard key",
    C: "Creating duplicate indexes on foreign keys",
    D: "Normalizing a schema to 3rd Normal Form"
  }, "B", "Sharding splits rows horizontally across distinct database servers to scale write throughput and storage."),

  createQ(17, "Node.js Architecture", "Medium", "Which core module in Node.js handles stream processing for large files?", {
    A: "fs and stream",
    B: "cluster",
    C: "v8",
    D: "dns"
  }, "A", "The stream module processes chunks of data iteratively without buffering the entire file in RAM."),

  createQ(18, "System Design", "Medium", "What is Rate Limiting used for in API gateways?", {
    A: "Compressing JSON responses to gzip",
    B: "Restricting the number of requests a client can make in a specified time window to prevent abuse and denial of service",
    C: "Limiting database connection pool sizes",
    D: "Enforcing password complexity requirements"
  }, "B", "Rate limiting protects services from brute-force, scraping, and DoS attacks by capping request volume."),

  createQ(19, "System Design", "Hard", "What is an event-driven architecture with message brokers (e.g., RabbitMQ, Kafka) primarily used for?", {
    A: "Rendering React components on server",
    B: "Decoupling services, handling asynchronous background jobs, and buffering traffic spikes",
    C: "Replacing SQL databases entirely",
    D: "Validating SSL certificates"
  }, "B", "Message queues allow asynchronous task distribution and smooth out peak load spikes between decoupled microservices."),

  createQ(20, "API Security", "Easy", "Why should passwords never be stored in plain text or with simple MD5 hashes?", {
    A: "They increase database table storage size",
    B: "They are easily cracked via precomputed rainbow tables; salted adaptive hashing algorithms (bcrypt, Argon2) must be used",
    C: "SQL cannot index strings longer than 16 characters",
    D: "Browsers reject plain text passwords automatically"
  }, "B", "bcrypt/Argon2 incorporate unique salts and adjustable work factors (stretching) to defeat brute-force and rainbow tables."),

  createQ(21, "Database Architecture", "Medium", "In SQL transactions, what does Isolation level prevent?", {
    A: "Network disconnects during query execution",
    B: "Concurrency anomalies such as Dirty Reads, Non-Repeatable Reads, and Phantom Reads",
    C: "Foreign key constraints",
    D: "Index fragmentation"
  }, "B", "Transaction isolation levels (Read Committed, Repeatable Read, Serializable) isolate concurrent operations."),

  createQ(22, "Node.js Architecture", "Medium", "What happens if an unhandled promise rejection occurs in modern Node.js?", {
    A: "Node ignores it and continues silently",
    B: "The Node.js process terminates with a non-zero exit code by default",
    C: "The operating system restarts the server hardware",
    D: "The browser client receives a 200 OK status"
  }, "B", "In modern Node.js, unhandled promise rejections trigger an unhandledRejection event and terminate the process."),

  createQ(23, "RESTful APIs", "Easy", "Which HTTP status code is appropriate when a client is authenticated but lacks permission to access the resource?", {
    A: "401 Unauthorized",
    B: "403 Forbidden",
    C: "404 Not Found",
    D: "400 Bad Request"
  }, "B", "401 means unauthenticated (login required); 403 means authenticated but unauthorized (forbidden access)."),

  createQ(24, "System Design", "Hard", "What is connection pooling in database drivers?", {
    A: "Pooling multiple database tables into one",
    B: "Maintaining a cache of open database connections that are reused across requests, avoiding expensive connection setup overhead",
    C: "Compressing SQL queries before transmission",
    D: "Running database queries over UDP instead of TCP"
  }, "B", "Connection pools reuse active sockets to eliminate the TCP/TLS handshake latency of establishing connections repeatedly."),

  createQ(25, "Database Architecture", "Medium", "What is the primary difference between SQL (relational) and NoSQL (document/key-value) databases?", {
    A: "SQL databases cannot store text strings",
    B: "SQL databases enforce structured schemas and ACID relational joins; NoSQL provides flexible schemas and horizontal scalability",
    C: "NoSQL databases do not support primary keys",
    D: "SQL databases run exclusively in web browsers"
  }, "B", "Relational databases emphasize structured integrity and transactions; NoSQL prioritizes partition tolerance and schema flexibility."),

  createQ(26, "API Security", "Medium", "What header does a client use to pass a Bearer token in an HTTP request?", {
    A: "Cookie",
    B: "Authorization",
    C: "X-Access-Token",
    D: "Proxy-Authenticate"
  }, "B", "The standard Authorization header uses the format: Authorization: Bearer <token>."),

  createQ(27, "Node.js Architecture", "Hard", "What is the Node.js Cluster module used for?", {
    A: "Connecting to Redis clusters",
    B: "Forking child worker processes that share server ports, allowing a Node application to utilize multiple CPU cores",
    C: "Running browser scripts in headless mode",
    D: "Managing npm package dependencies"
  }, "B", "Cluster spawns worker processes communicating via IPC, scaling single-threaded Node apps across all server CPU cores."),

  createQ(28, "System Design", "Medium", "What is the main benefit of implementing health check endpoints (/health) on microservices?", {
    A: "To measure API code coverage",
    B: "To allow orchestrators (Kubernetes, load balancers) to monitor service status and route traffic away from unhealthy instances",
    C: "To clear cache memory automatically",
    D: "To backup database records hourly"
  }, "B", "Health checks allow load balancers and orchestrators to automatically restart failed containers or remove them from pools."),

  createQ(29, "RESTful APIs", "Medium", "What is idempotency in the context of API design?", {
    A: "The ability of an API to handle 10,000 requests per second",
    B: "The property where making multiple identical requests has the same outcome as making a single request",
    C: "Ensuring all responses are returned in XML format",
    D: "Encrypting request payloads with AES-256"
  }, "B", "GET, PUT, and DELETE are idempotent because repeating the identical call produces no additional state side-effects."),

  createQ(30, "Database Architecture", "Hard", "What is an optimistic concurrency control strategy in database updates?", {
    A: "Locking the entire table during read operations",
    B: "Checking a record version/timestamp before writing to ensure no concurrent modification occurred between read and write",
    C: "Disabling transactions to maximize write speed",
    D: "Executing all writes asynchronously without waiting for acknowledgment"
  }, "B", "Optimistic locking assumes collisions are rare, verifying version/timestamp upon commit to reject conflicting updates.")
];

// -------------------------------------------------------------
// 4. ROLE_DATA_ANALYST (30 Questions)
// -------------------------------------------------------------
const dataAnalystQuestions = [
  createQ(1, "SQL", "Easy", "What is the difference between UNION and UNION ALL in SQL?", {
    A: "UNION combines tables from different databases; UNION ALL is for one database",
    B: "UNION removes duplicate rows with an implicit sort; UNION ALL retains all rows including duplicates and is faster",
    C: "UNION is for numeric columns only; UNION ALL is for text",
    D: "UNION requires matching table schemas; UNION ALL does not"
  }, "B", "UNION runs an internal de-duplication pass; UNION ALL directly appends datasets without deduplication."),

  createQ(2, "Data Wrangling", "Easy", "In Pandas, which method returns summary statistics (count, mean, std, min, max, quartiles) for numeric columns?", {
    A: "df.info()",
    B: "df.describe()",
    C: "df.summary()",
    D: "df.head()"
  }, "B", "df.describe() generates five-number summaries and central tendency statistics for numeric series."),

  createQ(3, "SQL", "Medium", "What does a LEFT JOIN return?", {
    A: "Only rows that have matching values in both tables",
    B: "All rows from the left table, along with matching rows from the right table (filling NULLs where no match exists)",
    C: "All rows from the right table only",
    D: "The Cartesian product of both tables"
  }, "B", "LEFT JOIN retains every record from the left relation, pairing right relation data where keys match."),

  createQ(4, "Data Visualization", "Easy", "Which chart type is best suited for displaying the distribution and spread of a continuous variable across categories?", {
    A: "Pie Chart",
    B: "Box Plot (Box-and-Whisker)",
    C: "Stacked Area Chart",
    D: "Radar Chart"
  }, "B", "Box plots display median, IQR, quartiles, and outliers across categorical cohorts compactly."),

  createQ(5, "Statistics", "Easy", "What is the difference between mean and median?", {
    A: "Mean is the middle value; median is the arithmetic average",
    B: "Mean is the arithmetic average (sensitive to outliers); median is the 50th percentile middle value (robust to outliers)",
    C: "Mean is for categorical data; median is for numeric data",
    D: "They are always mathematically identical"
  }, "B", "The mean sums values divided by n; the median finds the center point and is unaffected by extreme skewness."),

  createQ(6, "SQL", "Medium", "What does the SQL GROUP BY statement do?", {
    A: "Sorts records alphabetically",
    B: "Collapses rows that have the same values in specified columns into summary rows for aggregate functions",
    C: "Creates a temporary index on columns",
    D: "Filters rows before table joins"
  }, "B", "GROUP BY aggregates multiple records sharing identical attributes into group summary rows."),

  createQ(7, "Data Wrangling", "Medium", "How do you drop duplicate rows based on specific columns in Pandas?", {
    A: "df.remove_duplicates(columns=['A'])",
    B: "df.drop_duplicates(subset=['A'])",
    C: "df.unique(axis=1)",
    D: "df.filter(distinct=True)"
  }, "B", "df.drop_duplicates(subset=[...]) identifies and removes duplicate rows based on subset criteria."),

  createQ(8, "SQL", "Hard", "What is a Common Table Expression (CTE) in SQL?", {
    A: "A permanent database table with clustered index",
    B: "A temporary named result set defined with a WITH clause that exists only during query execution",
    C: "An encrypted database connection",
    D: "A stored procedure that accepts parameters"
  }, "B", "CTEs (WITH query_name AS (...)) create readable temporary result sets that can be referenced in primary queries."),

  createQ(9, "Business Intelligence", "Medium", "In data modeling, what is the fundamental difference between a Star Schema and a Snowflake Schema?", {
    A: "Star schemas use NoSQL; snowflake schemas use PostgreSQL",
    B: "Star schema dimension tables are denormalized; snowflake schema dimension tables are normalized into sub-dimensions",
    C: "Star schemas have no fact tables",
    D: "Snowflake schemas cannot store dates"
  }, "B", "Star schemas connect denormalized dimensions directly to central facts; snowflake normalizes dimensions into hierarchies."),

  createQ(10, "Data Wrangling", "Easy", "In Pandas, which function is used to handle missing values by replacing them with a fixed constant or calculated metric?", {
    A: "df.dropna()",
    B: "df.fillna()",
    C: "df.replace_null()",
    D: "df.impute()"
  }, "B", "df.fillna(value) substitutes missing NaN values with specified values or column statistics."),

  createQ(11, "SQL", "Hard", "Which SQL window function computes a cumulative moving total over ordered records?", {
    A: "SUM(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
    B: "COUNT(amount) GROUP BY date",
    C: "ROLLUP(amount)",
    D: "CUBE(amount)"
  }, "A", "Window functions with running frames compute cumulative aggregates without collapsing rows."),

  createQ(12, "Data Visualization", "Medium", "When is a Line Chart most appropriate compared to a Bar Chart?", {
    A: "When comparing unrelated categorical items",
    B: "When illustrating trends and changes in continuous data over time (time series)",
    C: "When showing parts of a whole summing to 100%",
    D: "When plotting high-dimensional clusters"
  }, "B", "Line charts connect continuous data points, emphasizing direction, trends, and seasonal changes over time."),

  createQ(13, "Statistics", "Medium", "What does the Interquartile Range (IQR) represent?", {
    A: "The difference between maximum and minimum values",
    B: "The range of the middle 50% of data (Q3 - Q1)",
    C: "The standard deviation divided by mean",
    D: "The difference between mean and mode"
  }, "B", "IQR = 75th percentile (Q3) - 25th percentile (Q1), defining the dispersion of the middle half of data."),

  createQ(14, "SQL", "Medium", "What is the result of using a FULL OUTER JOIN?", {
    A: "Only matching records from both tables",
    B: "All records from both tables, joining where keys match and inserting NULLs for missing relationships on either side",
    C: "A Cartesian product of all rows",
    D: "An empty dataset if any NULL exists"
  }, "B", "FULL OUTER JOIN combines the results of both LEFT and RIGHT outer joins."),

  createQ(15, "Data Wrangling", "Medium", "What does the Pandas `df.pivot_table()` function perform?", {
    A: "Transposes rows and columns with no aggregation",
    B: "Reshapes data by turning unique values from one column into multiple columns with an aggregate summary metric",
    C: "Deletes duplicate rows",
    D: "Exports data to SQLite"
  }, "B", "pivot_table reshapes multidimensional data into spreadsheet-style pivot summaries with aggregation."),

  createQ(16, "Business Intelligence", "Easy", "What is a KPI (Key Performance Indicator)?", {
    A: "A database encryption key",
    B: "A measurable metric that tracks how effectively a company is achieving key business objectives",
    C: "A primary key constraint in SQL",
    D: "An algorithm complexity rating"
  }, "B", "KPIs (e.g., Churn Rate, CAC, LTV, MRR) quantify performance progress toward operational targets."),

  createQ(17, "SQL", "Easy", "Which SQL command is used to sort query results in descending order?", {
    A: "SORT DOWN",
    B: "ORDER BY column DESC",
    C: "GROUP BY column DESC",
    D: "ARRANGE DESC"
  }, "B", "ORDER BY column DESC orders result records from highest to lowest."),

  createQ(18, "Data Visualization", "Easy", "Why are 3D Pie Charts generally discouraged in professional data visualization dashboards?", {
    A: "They consume too much server GPU memory",
    B: "Perspective distortion skews angles and makes area comparison deceptive to human visual perception",
    C: "They only work on touchscreen monitors",
    D: "SQL databases cannot export to 3D"
  }, "B", "3D angles distort wedge proportions, causing foreground slices to appear deceptively larger than true values."),

  createQ(19, "Data Wrangling", "Hard", "What does Pandas `df.melt()` do?", {
    A: "Converts wide-format DataFrames into long-format DataFrames by unpivoting columns into key-value pairs",
    B: "Merges two DataFrames on index",
    C: "Deletes null values permanently",
    D: "Converts data to JSON format"
  }, "A", "melt unpivots wide columns into tidy long rows, ideal for analytical reshaping."),

  createQ(20, "Statistics", "Medium", "What does a correlation of -0.85 between variable X and variable Y indicate?", {
    A: "A weak positive linear relationship",
    B: "A strong negative linear relationship (as X increases, Y tends to decrease)",
    C: "There is no relationship between X and Y",
    D: "X causes Y to decrease"
  }, "B", "Negative values near -1 indicate strong inverse linear associations (correlation does not imply causation)."),

  createQ(21, "SQL", "Medium", "What is the difference between COUNT(*) and COUNT(column_name) in SQL?", {
    A: "COUNT(*) counts all rows including NULLs; COUNT(column_name) counts only rows where the column value is NOT NULL",
    B: "COUNT(*) is slower than COUNT(column_name) in all cases",
    C: "COUNT(column_name) deletes nulls from the table",
    D: "They are completely identical in all SQL engines"
  }, "A", "COUNT(*) tallies every tuple; COUNT(col) excludes records where that specific column contains NULL."),

  createQ(22, "Business Intelligence", "Medium", "What is cohort analysis primarily used for in product analytics?", {
    A: "Estimating server cloud hosting bills",
    B: "Tracking the behavioral retention and churn of user groups who share a common characteristic (such as signup month) over time",
    C: "Measuring database query execution time",
    D: "Cleaning duplicate customer emails"
  }, "B", "Cohort analysis breaks user populations into time-grouped cohorts to evaluate lifecycle retention."),

  createQ(23, "SQL", "Hard", "What does the SQL `CASE WHEN ... THEN ... ELSE ... END` construct enable?", {
    A: "Executing DDL schema migrations",
    B: "Conditional branching logic directly within SELECT, WHERE, and GROUP BY expressions",
    C: "Looping through records with cursors",
    D: "Creating foreign key constraints"
  }, "B", "CASE expressions provide if-then-else conditional evaluation inside SQL queries."),

  createQ(24, "Data Wrangling", "Easy", "How do you filter rows in a Pandas DataFrame where column 'age' is greater than 25?", {
    A: "df.filter(age > 25)",
    B: "df[df['age'] > 25]",
    C: "df.select('age > 25')",
    D: "df.where('age > 25')"
  }, "B", "Boolean indexing `df[df['age'] > 25]` evaluates a boolean mask to filter rows."),

  createQ(25, "Data Visualization", "Medium", "What is a Heatmap primarily used to visualize?", {
    A: "3D topographical elevation models",
    B: "A 2D matrix of values where individual values are represented by varying color intensities (e.g., correlation matrix)",
    C: "System network hardware temperatures",
    D: "Single-column categorical counts"
  }, "B", "Heatmaps use color gradients across a matrix to highlight magnitude, correlation, and density patterns."),

  createQ(26, "Statistics", "Easy", "In a standard normal distribution, approximately what percentage of data falls within 1 standard deviation of the mean?", {
    A: "50%",
    B: "68%",
    C: "95%",
    D: "99.7%"
  }, "B", "By the empirical rule (68-95-99.7 rule), ~68% of normal distribution values lie within 1 standard deviation."),

  createQ(27, "SQL", "Medium", "What is the purpose of the `COALESCE()` function in SQL?", {
    A: "Combines two strings together",
    B: "Returns the first non-null expression from a list of arguments",
    C: "Deletes null rows from a table",
    D: "Calculates average excluding zeros"
  }, "B", "COALESCE(col1, col2, default_val) returns the first non-NULL expression in sequence."),

  createQ(28, "Data Wrangling", "Medium", "In Pandas, which method converts a column of date strings into datetime objects?", {
    A: "pd.to_datetime(df['date'])",
    B: "df['date'].as_date()",
    C: "pd.format_date(df['date'])",
    D: "df['date'].cast('date')"
  }, "A", "pd.to_datetime() parses string timestamps into standardized Pandas Timestamp objects."),

  createQ(29, "Business Intelligence", "Hard", "What does Customer Churn Rate measure?", {
    A: "The percentage of website visitors who convert to paid users",
    B: "The percentage of customers who stop doing business or cancel their subscriptions over a specified timeframe",
    C: "The average customer acquisition cost",
    D: "The ratio of customer complaints to sales"
  }, "B", "Churn Rate = (Customers lost during period / Total customers at start of period) * 100."),

  createQ(30, "SQL", "Hard", "Which SQL operator checks whether a subquery returns ANY rows at all?", {
    A: "IN",
    B: "EXISTS",
    C: "BETWEEN",
    D: "LIKE"
  }, "B", "EXISTS checks for presence of matching records and halts evaluation on first match, making it efficient.")
];

// -------------------------------------------------------------
// 5. ROLE_PYTHON_DEV (30 Questions)
// -------------------------------------------------------------
const pythonDevQuestions = [
  createQ(1, "Python Core", "Medium", "What is the Global Interpreter Lock (GIL) in CPython?", {
    A: "A security sandbox preventing arbitrary file imports",
    B: "A mutex that prevents multiple native OS threads from executing Python bytecodes simultaneously",
    C: "A memory leak prevention algorithm in the garbage collector",
    D: "A package manager for virtual environments"
  }, "B", "CPython's GIL ensures thread safety for memory management by restricting bytecode execution to 1 thread at a time."),

  createQ(2, "Python Core", "Easy", "Which of the following built-in data types in Python is IMMUTABLE?", {
    A: "list",
    B: "dict",
    C: "tuple",
    D: "set"
  }, "C", "Tuples, strings, and integers are immutable; lists, dictionaries, and sets are mutable."),

  createQ(3, "Python Core", "Medium", "What does the `yield` keyword do inside a Python function?", {
    A: "Terminates the program execution immediately",
    B: "Turns the function into a generator that produces values lazily on iteration",
    C: "Throws an unhandled exception",
    D: "Allocates a new process thread"
  }, "B", "yield pauses function execution, returning a value and maintaining local state for generator resumption."),

  createQ(4, "Python Core", "Medium", "What is a Python Decorator?", {
    A: "A CSS style rule for web pages",
    B: "A callable function that takes another function as an argument and extends its behavior without modifying its source",
    C: "A class that implements the Singleton pattern",
    D: "A garbage collection optimization flag"
  }, "B", "Decorators (@decorator_name) wrap functions, modifying inputs, outputs, or execution behavior dynamically."),

  createQ(5, "Python OOP", "Easy", "What is the role of `__init__` in a Python class definition?", {
    A: "It destroys the object when garbage collected",
    B: "It is the constructor initializer method called when a new instance of the class is created",
    C: "It defines static class variables",
    D: "It compiles the class to C code"
  }, "B", "The __init__ method initializes attributes of newly created class instances."),

  createQ(6, "Python Core", "Hard", "What is the difference between `==` and `is` in Python?", {
    A: "`==` compares object identity (memory addresses); `is` compares equality of values",
    B: "`==` compares equality of values; `is` checks object identity (same memory address in RAM)",
    C: "They are completely identical in all versions of Python",
    D: "`is` is used only for numeric types"
  }, "B", "`==` evaluates value equality via __eq__; `is` checks whether id(a) == id(b) (identity in memory)."),

  createQ(7, "Python Asyncio", "Hard", "In Python `asyncio`, what does the `await` keyword do?", {
    A: "Blocks the entire operating system process until completion",
    B: "Suspends the execution of the surrounding async coroutine, yielding control back to the event loop",
    C: "Forces synchronous execution on a background thread pool",
    D: "Cancels the active task"
  }, "B", "await pauses the coroutine, allowing the single-threaded event loop to execute other tasks during I/O."),

  createQ(8, "Python Core", "Easy", "What is list comprehension in Python?", {
    A: "A tool that documents list functions",
    B: "A concise, expressive syntax for creating lists from iterables based on conditions",
    C: "A method that sorts lists in-place",
    D: "A memory profiler for collections"
  }, "B", "List comprehension [f(x) for x in iterable if cond] provides a concise and fast way to construct lists."),

  createQ(9, "Python Core", "Medium", "What is the difference between `deepcopy` and `shallow copy` in Python's `copy` module?", {
    A: "Shallow copy copies objects recursively; deepcopy copies only references",
    B: "Shallow copy constructs a new compound object but inserts references into original elements; deepcopy recursively copies all nested objects",
    C: "Deepcopy works only on primitive strings",
    D: "Shallow copy converts lists to tuples"
  }, "B", "Deepcopy duplicates the entire object hierarchy so modifications to nested structures do not affect the original."),

  createQ(10, "Python Core", "Medium", "What do `*args` and `**kwargs` allow in function parameter definitions?", {
    A: "Pointers and memory references like in C",
    B: "Passing variable numbers of positional arguments (*args) and keyword arguments (**kwargs)",
    C: "Defining abstract base class methods",
    D: "Enforcing static type checking at compile time"
  }, "B", "*args collects extra positional parameters as a tuple; **kwargs collects named keyword arguments as a dictionary."),

  createQ(11, "Python Core", "Hard", "How does Python handle memory management and cleanup for objects?", {
    A: "Pure manual free() and malloc() calls like C",
    B: "Reference counting supplemented by a cyclic garbage collector to detect circular references",
    C: "Stop-the-world tracing GC only",
    D: "Allocating all memory on the OS call stack"
  }, "B", "CPython tracks reference counts for instant deallocation, using generational GC to resolve cyclic references."),

  createQ(12, "Python OOP", "Medium", "What is the Method Resolution Order (MRO) in Python multiple inheritance?", {
    A: "The order in which files are imported",
    B: "The order in which Python searches for attributes and methods across class hierarchies (computed via C3 Linearization)",
    C: "The order in which variables are cleared from memory",
    D: "The alphabetical order of methods"
  }, "B", "Python uses C3 Linearization algorithm to determine method resolution order across multiple inherited classes."),

  createQ(13, "Python Core", "Easy", "How do you open a file safely in Python to guarantee it closes even if exceptions occur?", {
    A: "file = open('data.txt'); file.close()",
    B: "with open('data.txt') as file:",
    C: "try { open('data.txt') }",
    D: "file = read('data.txt')"
  }, "B", "Context managers (`with open(...)`) invoke __enter__ and __exit__, guaranteeing file descriptors close cleanly."),

  createQ(14, "Python Core", "Medium", "What is the time complexity of looking up a key in a standard Python `dict`?", {
    A: "O(N) linear time",
    B: "O(1) average time complexity",
    C: "O(log N) logarithmic time",
    D: "O(N^2) quadratic time"
  }, "B", "Python dictionaries use open-addressing hash tables with perturbation, achieving O(1) average key lookup."),

  createQ(15, "Python Core", "Medium", "What is the purpose of the `__str__` vs `__repr__` dunder methods?", {
    A: "`__str__` is for debugging; `__repr__` is for end-users",
    B: "`__str__` provides human-readable representation; `__repr__` aims to provide unambiguous representation (often valid Python code)",
    C: "They are completely interchangeable",
    D: "`__repr__` converts objects to binary byte arrays"
  }, "B", "__str__ is intended for end-user readability; __repr__ is for developers and debugging."),

  createQ(16, "Python Core", "Hard", "What is a Metaclass in Python?", {
    A: "A class that imports C libraries",
    B: "A class whose instances are classes; it defines how a class itself is created and structured",
    C: "An abstract class that cannot have methods",
    D: "A documentation generator"
  }, "B", "Just as an object is an instance of a class, a class is an instance of a metaclass (by default `type`)."),

  createQ(17, "Python Core", "Easy", "What built-in function returns an iterator of tuples containing the index and item from a sequence?", {
    A: "zip()",
    B: "enumerate()",
    C: "map()",
    D: "filter()"
  }, "B", "enumerate(sequence, start=0) yields (index, element) tuples during iteration."),

  createQ(18, "Python Core", "Medium", "What does the `zip()` function do when passed two lists of different lengths?", {
    A: "Raises a ValueError immediately",
    B: "Stops iteration when the shortest input iterable is exhausted (unless using itertools.zip_longest)",
    C: "Pads the shorter list with zeros",
    D: "Cycles the shorter list infinitely"
  }, "B", "Standard zip() terminates as soon as the shortest iterable finishes."),

  createQ(19, "Python Core", "Medium", "What does `@staticmethod` mean compared to `@classmethod` in Python?", {
    A: "@staticmethod receives the class `cls` as first parameter; @classmethod does not",
    B: "@staticmethod receives neither `self` nor `cls`; @classmethod receives `cls` as its first parameter",
    C: "@staticmethod cannot be called from class instances",
    D: "They are identical"
  }, "B", "Static methods behave like plain functions bound to class namespace; class methods receive the class object."),

  createQ(20, "Python Core", "Hard", "What is the difference between multiprocessing and multithreading in standard CPython?", {
    A: "Multithreading bypasses the GIL; multiprocessing does not",
    B: "Multiprocessing runs separate processes with separate memory spaces and GILs across multiple CPU cores; multithreading shares one GIL and memory space",
    C: "Multiprocessing is for I/O-bound tasks only",
    D: "Threads cannot communicate with each other"
  }, "B", "Multiprocessing bypasses GIL restrictions for CPU-bound tasks by spawning independent processes."),

  createQ(21, "Python Core", "Easy", "How are comments written in Python?", {
    A: "// comment",
    B: "# comment",
    C: "/* comment */",
    D: "<!-- comment -->"
  }, "B", "Single line comments in Python begin with the hash `#` character."),

  createQ(22, "Python Core", "Medium", "What is the output of `type(lambda x: x)` in Python?", {
    A: "<class 'function'>",
    B: "<class 'lambda'>",
    C: "<class 'method'>",
    D: "<class 'object'>"
  }, "A", "Lambda expressions create anonymous function instances whose type is `function`."),

  createQ(23, "Python Core", "Hard", "What does `__slots__` do when defined in a Python class?", {
    A: "Restricts object creation to 5 instances",
    B: "Prevents creation of instance `__dict__`, reducing memory consumption and speeding attribute access for millions of instances",
    C: "Encodes the class attributes into JSON",
    D: "Locks the class against inheritance"
  }, "B", "__slots__ reserves space for a fixed set of attributes, avoiding overhead of per-instance dictionaries."),

  createQ(24, "Python Core", "Medium", "What is the purpose of `collections.defaultdict`?", {
    A: "It restricts dictionary keys to string types",
    B: "It provides a default value for non-existent keys via a factory callable, avoiding KeyError exceptions",
    C: "It sorts keys automatically",
    D: "It creates an immutable dictionary"
  }, "B", "defaultdict calls a default factory (e.g., list, int) when accessing missing keys rather than raising KeyError."),

  createQ(25, "Python Core", "Easy", "Which statement is used to catch and handle exceptions in Python?", {
    A: "catch { ... }",
    B: "try ... except",
    C: "try ... catch",
    D: "rescue { ... }"
  }, "B", "Python uses `try: ... except Exception as e:` blocks for structured exception handling."),

  createQ(26, "Python Core", "Medium", "What does `functools.lru_cache` decorator do?", {
    A: "Encrypts function arguments",
    B: "Memoizes function return values up to a maximum cache size using Least Recently Used replacement policy",
    C: "Limits function execution time to 1 second",
    D: "Runs the function on a worker thread"
  }, "B", "lru_cache wraps functions with a memoizing callable, eliminating redundant computations for identical arguments."),

  createQ(27, "Python Core", "Hard", "What is the difference between an Iterable and an Iterator in Python?", {
    A: "An iterable implements __next__(); an iterator implements __len__()",
    B: "An iterable implements __iter__() returning an iterator; an iterator implements __next__() returning values and raising StopIteration when exhausted",
    C: "They are completely interchangeable terms",
    D: "Iterators cannot be used in for loops"
  }, "B", "Iterables can be looped over (producing iterators); iterators represent streams of data accessed via next()."),

  createQ(28, "Python Core", "Medium", "What is the result of `bool([])` and `bool({})` in Python?", {
    A: "True, True",
    B: "False, False",
    C: "True, False",
    D: "None, None"
  }, "B", "Empty collections (lists, dicts, tuples, sets, strings) and 0 evaluate to False in boolean contexts."),

  createQ(29, "Python Core", "Medium", "What does `any([False, False, True])` and `all([False, False, True])` evaluate to?", {
    A: "True, False",
    B: "False, True",
    C: "True, True",
    D: "False, False"
  }, "A", "any() returns True if at least one item is truthy; all() requires every single item to be truthy."),

  createQ(30, "Python Core", "Hard", "In Python context managers, what must the `__exit__` method return to suppress an exception that occurred inside the `with` block?", {
    A: "None",
    B: "A truthy value (e.g. True)",
    C: "False",
    D: "An integer code 0"
  }, "B", "If __exit__ returns True, Python suppresses the active exception and continues execution after the with block.")
];

// -------------------------------------------------------------
// 6. ROLE_FULLSTACK_DEV (30 Questions)
// -------------------------------------------------------------
const fullstackDevQuestions = [
  createQ(1, "React Architecture", "Medium", "Why should you never mutate React state directly (e.g., `state.count = 5`)?", {
    A: "It will throw a fatal JavaScript syntax error",
    B: "React relies on shallow reference equality checks; direct mutation skips reconciliation and does not trigger re-rendering",
    C: "Direct mutation corrupts the backend database automatically",
    D: "Objects in JavaScript are strictly read-only"
  }, "B", "React compares previous and next references; mutating an object retains its memory address, skipping UI updates."),

  createQ(2, "Frontend Core", "Medium", "What is the Virtual DOM in React?", {
    A: "A browser extension that speeds up internet connections",
    B: "An in-memory lightweight JavaScript representation of the real DOM tree used to compute minimal DOM patch diffs",
    C: "A shadow database hosted on CDN",
    D: "A WebGL rendering canvas"
  }, "B", "The Virtual DOM calculates changes in memory (reconciliation), batching minimal atomic writes to the real DOM."),

  createQ(3, "React Hooks", "Easy", "What is the primary purpose of the `useEffect` hook in React functional components?", {
    A: "To compile TypeScript to JavaScript",
    B: "To perform side effects (data fetching, subscriptions, manual DOM manipulation) after render",
    C: "To style CSS components",
    D: "To replace Redux store management"
  }, "B", "useEffect coordinates side-effects in functional components, executing according to dependency array changes."),

  createQ(4, "Web Security", "Medium", "What is Cross-Site Scripting (XSS)?", {
    A: "An attack where malicious JavaScript code is injected into web pages viewed by other users",
    B: "An attack that cracks database root passwords via brute force",
    C: "Overloading web servers with fraudulent TCP packets",
    D: "Using multiple CSS stylesheets on the same HTML page"
  }, "A", "XSS executes arbitrary attacker scripts in victim browsers, stealing cookies or session credentials."),

  createQ(5, "Frontend Core", "Easy", "What does CSS Box Model consist of, from innermost to outermost?", {
    A: "Content, Padding, Border, Margin",
    B: "Margin, Border, Padding, Content",
    C: "Content, Margin, Border, Padding",
    D: "Border, Content, Padding, Margin"
  }, "A", "The CSS box model layers are Content -> Padding -> Border -> Margin."),

  createQ(6, "React Hooks", "Medium", "What happens when you pass an empty dependency array `[]` to `useEffect`?", {
    A: "The effect runs on every single component re-render",
    B: "The effect runs only once after the initial component mount",
    C: "The effect is disabled and never runs",
    D: "The component immediately unmounts"
  }, "B", "An empty dependency array [] indicates the effect depends on no changing state, running once on mount."),

  createQ(7, "Fullstack Integration", "Medium", "What is the purpose of the CORS preflight OPTIONS request?", {
    A: "To compress API responses with gzip",
    B: "To verify whether the server permits the actual cross-origin request method, headers, and credentials before sending it",
    C: "To cache the HTML payload on proxy servers",
    D: "To encrypt payload parameters with TLS"
  }, "B", "Browsers automatically send preflight OPTIONS requests for non-simple cross-origin requests to check permissions."),

  createQ(8, "JavaScript Core", "Medium", "What is the difference between `null` and `undefined` in JavaScript?", {
    A: "`null` is assigned automatically to uninitialized variables; `undefined` represents intentional absence",
    B: "`undefined` represents a declared variable with no assigned value; `null` is an assigned primitive representing intentional absence of object",
    C: "They are completely identical with no differences",
    D: "`null` has type 'null'; `undefined` has type 'object'"
  }, "B", "undefined means variable is declared without value; null represents an explicit assignment of 'no value'."),

  createQ(9, "React Architecture", "Medium", "What is the purpose of the `key` prop when rendering lists in React?", {
    A: "To style each list element uniquely",
    B: "To give elements a stable identity, helping React determine which items have changed, added, or removed during reconciliation",
    C: "To encrypt list data before rendering",
    D: "To index database primary keys automatically"
  }, "B", "Keys enable efficient DOM reconciliation, preventing unnecessary DOM destroys and recreations on list updates."),

  createQ(10, "Frontend Core", "Medium", "What is the difference between `flexbox` and `CSS Grid`?", {
    A: "Flexbox is for 1-dimensional layouts (rows or columns); CSS Grid is for 2-dimensional layouts (rows and columns simultaneously)",
    B: "Flexbox works only on mobile screens; CSS Grid is for desktops",
    C: "CSS Grid is deprecated in modern CSS",
    D: "Flexbox requires JavaScript"
  }, "A", "Flexbox is designed for linear 1D component distribution; Grid manages complex 2D spatial layouts."),

  createQ(11, "JavaScript Core", "Hard", "What is Event Bubbling in JavaScript DOM events?", {
    A: "Events fire exclusively on the document root element",
    B: "When an event triggers on an element, it first runs handlers on that element, then bubbles up to its parents all the way to the document root",
    C: "Events are queued in localStorage",
    D: "Canceling all keyboard inputs"
  }, "B", "Event bubbling propagates events upwards through ancestor DOM elements unless stopped by event.stopPropagation()."),

  createQ(12, "React Hooks", "Medium", "What does the `useMemo` hook do in React?", {
    A: "Creates persistent database connections",
    B: "Memoizes the result of an expensive calculation, recalculating only when specified dependencies change",
    C: "Caches network API calls in browser cookies",
    D: "Saves component state to localStorage"
  }, "B", "useMemo caches computed values to prevent expensive recalculations during component re-renders."),

  createQ(13, "Fullstack Integration", "Hard", "What is CSRF (Cross-Site Request Forgery) and how is it prevented?", {
    A: "Injecting malicious scripts into URLs; prevented with HTTPS",
    B: "Tricking an authenticated user's browser into executing unwanted actions on a trusted site; prevented using Anti-CSRF tokens and SameSite cookies",
    C: "A database transaction deadlock",
    D: "Server CPU throttling attack"
  }, "B", "CSRF exploits ambient browser authentication (cookies); prevented by checking unpredictable CSRF tokens and SameSite=Strict cookies."),

  createQ(14, "JavaScript Core", "Medium", "What is a Closure in JavaScript?", {
    A: "A method that terminates an open browser window",
    B: "A function bundled together with references to its surrounding lexical state (outer scope variables) even after the outer function has returned",
    C: "A syntax error that halts execution",
    D: "An immediately invoked constructor"
  }, "B", "Closures give functions access to outer lexical scope variables even after outer functions have executed."),

  createQ(15, "Frontend Performance", "Medium", "What is Lazy Loading of components in React (`React.lazy()` and `Suspense`)?", {
    A: "Delaying component rendering until the user clicks a button",
    B: "Code-splitting the bundle into separate chunks that are downloaded over the network only when the component is about to be rendered",
    C: "Compressing images with WebP",
    D: "Running component code in a web worker"
  }, "B", "React.lazy dynamically imports components on demand, reducing initial bundle size and accelerating initial load."),

  createQ(16, "Fullstack Integration", "Easy", "What format is most universally used for data exchange between frontend JavaScript and backend REST APIs?", {
    A: "XML",
    B: "JSON (JavaScript Object Notation)",
    C: "CSV",
    D: "Protocol Buffers only"
  }, "B", "JSON is lightweight, human-readable, and natively parsed by JavaScript and modern backend frameworks."),

  createQ(17, "React Hooks", "Medium", "What is the difference between `useCallback` and `useMemo`?", {
    A: "useCallback memoizes a function instance; useMemo memoizes the computed result of a function",
    B: "useCallback is for API calls; useMemo is for styling",
    C: "They are exact synonyms in React",
    D: "useCallback runs only on unmount"
  }, "A", "useCallback(fn, deps) returns memoized callback; useMemo(() => val, deps) returns memoized value."),

  createQ(18, "Web Security", "Hard", "What is a Content Security Policy (CSP)?", {
    A: "A document detailing user privacy terms",
    B: "An HTTP response header that restricts which resource domains (scripts, styles, images) a browser is permitted to load and execute",
    C: "A database encryption protocol",
    D: "A stylesheet validation tool"
  }, "B", "CSP prevents XSS and code injection by declaring trusted sources of executable scripts in HTTP headers."),

  createQ(19, "Frontend Core", "Medium", "What does the JavaScript event loop do when the call stack is empty?", {
    A: "Shuts down the browser tab",
    B: "Checks the microtask queue (Promises), executes all microtasks, and then processes the next task from the macrotask queue (setTimeout, I/O)",
    C: "Re-renders the entire HTML page",
    D: "Clears all variable memories"
  }, "B", "The event loop continuously dequeues microtasks (Promise jobs) before proceeding to macrotasks."),

  createQ(20, "React Architecture", "Hard", "What problem does 'Prop Drilling' describe in React, and how is it solved?", {
    A: "Calling props before initialization; solved with TypeScript",
    B: "Passing data through multiple intermediate component layers that do not need it; solved using React Context or global state managers",
    C: "A circular dependency between two components",
    D: "State mutations inside child components"
  }, "B", "Prop drilling forces deep component hierarchies to thread unused props; Context API broadcasts state directly."),

  createQ(21, "Fullstack Integration", "Medium", "What is the purpose of WebSockets compared to standard HTTP requests?", {
    A: "WebSockets encrypt data; HTTP does not",
    B: "WebSockets establish a persistent, bidirectional, full-duplex communication channel over a single TCP connection for real-time data",
    C: "WebSockets work only on mobile browsers",
    D: "WebSockets replace CSS styles"
  }, "B", "WebSockets enable persistent full-duplex messaging between client and server without HTTP polling overhead."),

  createQ(22, "JavaScript Core", "Easy", "What is the output of `typeof []` and `typeof null` in JavaScript?", {
    A: "'array', 'null'",
    B: "'object', 'object'",
    C: "'list', 'undefined'",
    D: "'array', 'undefined'"
  }, "B", "In JavaScript, arrays and null both return 'object' due to legacy ECMAScript implementation details."),

  createQ(23, "React Architecture", "Medium", "What is a React Higher-Order Component (HOC)?", {
    A: "A component with higher z-index in CSS",
    B: "A function that takes a component as an argument and returns a new enhanced component with additional props or behavior",
    C: "A component rendered on top of the root element",
    D: "An asynchronous server-side function"
  }, "B", "HOCs are pure functions that enhance components with reusable logic (e.g., withAuth(Dashboard))."),

  createQ(24, "Frontend Performance", "Medium", "What is Debouncing in event handling (e.g., live search input)?", {
    A: "Executing an action on every keystroke immediately",
    B: "Delaying execution of a function until a specified cooldown time has passed without any new events triggering",
    C: "Caching API responses in IndexedDB",
    D: "Limiting request volume to 1 per second constantly"
  }, "B", "Debouncing waits for user typing to pause before invoking search APIs, preventing wasteful burst calls."),

  createQ(25, "Fullstack Integration", "Hard", "What does Server-Side Rendering (SSR) in frameworks like Next.js achieve compared to Client-Side Rendering (CSR)?", {
    A: "It eliminates backend databases completely",
    B: "It generates initial HTML on the server before sending it to the client, improving First Contentful Paint (FCP) and SEO indexing",
    C: "It disables JavaScript execution in the browser",
    D: "It runs React directly on the database engine"
  }, "B", "SSR renders static HTML server-side, enabling web crawlers to index content and improving initial load speed."),

  createQ(26, "JavaScript Core", "Medium", "What does `Promise.all([p1, p2, p3])` do if one of the promises rejects?", {
    A: "It waits for other promises and returns successfully with partial results",
    B: "It immediately rejects with the error of the first rejected promise (fail-fast behavior)",
    C: "It retries the failed promise 3 times",
    D: "It converts the rejection into an empty array"
  }, "B", "Promise.all fails fast: if any constituent promise rejects, the returned aggregate promise immediately rejects."),

  createQ(27, "Web Security", "Medium", "What does the `SameSite=Lax` attribute on cookies provide?", {
    A: "Blocks cookies from being sent on any cross-site top-level navigation",
    B: "Withholds cookies on cross-site subrequests (like images or iframes), but permits them when users navigate to the origin site directly (GET links)",
    C: "Encrypts cookie contents using RSA-2048",
    D: "Deletes cookies after 10 minutes"
  }, "B", "SameSite=Lax provides a balanced defense against CSRF while preserving user session continuity on top-level clicks."),

  createQ(28, "Frontend Core", "Medium", "What is the difference between `localStorage` and `sessionStorage`?", {
    A: "localStorage data persists until explicitly cleared; sessionStorage data is deleted when the browser tab/session closes",
    B: "localStorage holds up to 500MB; sessionStorage holds 5MB",
    C: "sessionStorage data is sent to server in HTTP headers automatically",
    D: "localStorage works only in private browsing mode"
  }, "A", "localStorage persists across browser restarts; sessionStorage lives only for the lifetime of that specific tab."),

  createQ(29, "React Hooks", "Hard", "What is the purpose of the `useRef` hook in React?", {
    A: "To trigger component re-render when a value changes",
    B: "To persist a mutable reference across renders WITHOUT triggering re-render, and to hold direct references to DOM nodes",
    C: "To memoize expensive calculation outputs",
    D: "To manage global application routes"
  }, "B", "useRef holds mutable values that persist across renders without causing component reconciliation updates."),

  createQ(30, "Fullstack Integration", "Medium", "What is the role of an API Gateway in modern microservice architectures?", {
    A: "To compile frontend React code into native Android apps",
    B: "To act as a single entry point handling routing, authentication, rate limiting, and telemetry before requests reach backend microservices",
    C: "To replace DNS servers worldwide",
    D: "To store database backups in S3"
  }, "B", "An API gateway aggregates microservice endpoints, managing auth, SSL, rate-limits, and routing centrally.")
];

const questionBank = {
  ROLE_DATA_SCIENTIST: dataScientistQuestions,
  ROLE_AI_ENGINEER: aiEngineerQuestions,
  ROLE_BACKEND_DEV: backendDevQuestions,
  ROLE_DATA_ANALYST: dataAnalystQuestions,
  ROLE_PYTHON_DEV: pythonDevQuestions,
  ROLE_FULLSTACK_DEV: fullstackDevQuestions
};

// Validate counts
console.log('--- VALIDATING QUESTION BANK COUNTS ---');
Object.entries(questionBank).forEach(([role, qList]) => {
  console.log(`${role}: ${qList.length} questions`);
  if (qList.length < 30) {
    throw new Error(`Role ${role} has only ${qList.length} questions, expected at least 30!`);
  }
});

const outputPath = path.join(__dirname, 'fallbackQuestions.json');
fs.writeFileSync(outputPath, JSON.stringify(questionBank, null, 2), 'utf8');
console.log(`\nSuccessfully wrote 180 questions (${Object.keys(questionBank).length} roles x 30 questions) to ${outputPath}`);
